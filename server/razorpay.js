import { head } from '@vercel/blob'
import Razorpay from 'razorpay'
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const PRODUCT_AMOUNT_PAISE = 900
const PRODUCT_CURRENCY = 'INR'
const GUIDE_BLOB_PATH = 'hair-fall-control-guide.pdf'
const DOWNLOAD_TOKEN_TTL_MS = 15 * 60 * 1000

function jsonResult(statusCode, body) {
  return { statusCode, body }
}

function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) return null
  return { keyId, keySecret }
}

function makeClient(config) {
  return new Razorpay({ key_id: config.keyId, key_secret: config.keySecret })
}

function isAuthenticationError(error) {
  return error?.statusCode === 401 || error?.error?.statusCode === 401 || error?.error?.code === 'AUTHENTICATION_ERROR'
}

function parsePayload(payload) {
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload)
    } catch {
      return null
    }
  }
  return payload && typeof payload === 'object' ? payload : null
}

function signaturesMatch(expectedHex, actualHex) {
  if (typeof actualHex !== 'string' || !/^[a-f\d]{64}$/i.test(actualHex)) return false
  const expected = Buffer.from(expectedHex, 'hex')
  const actual = Buffer.from(actualHex, 'hex')
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

function downloadTokenSignatureMatches(expected, actual) {
  if (typeof actual !== 'string' || !/^[A-Za-z\d_-]{43}$/.test(actual)) return false
  const expectedBytes = Buffer.from(expected, 'base64url')
  const actualBytes = Buffer.from(actual, 'base64url')
  return expectedBytes.length === actualBytes.length && timingSafeEqual(expectedBytes, actualBytes)
}

function createDownloadToken(orderId, paymentId, keySecret) {
  const payload = Buffer.from(JSON.stringify({
    order_id: orderId,
    payment_id: paymentId,
    expires_at: Date.now() + DOWNLOAD_TOKEN_TTL_MS,
  })).toString('base64url')
  const signature = createHmac('sha256', keySecret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

function readDownloadToken(token, keySecret) {
  if (typeof token !== 'string' || token.length > 2048) return null
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra !== undefined) return null

  const expectedSignature = createHmac('sha256', keySecret).update(payload).digest('base64url')
  if (!downloadTokenSignatureMatches(expectedSignature, signature)) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (
      typeof data.order_id !== 'string' || !/^order_[A-Za-z0-9]+$/.test(data.order_id) ||
      typeof data.payment_id !== 'string' || !/^pay_[A-Za-z0-9]+$/.test(data.payment_id) ||
      !Number.isSafeInteger(data.expires_at) || data.expires_at <= Date.now()
    ) return null
    return data
  } catch {
    return null
  }
}

async function guideIsAvailable() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return false

  try {
    const guide = await head(GUIDE_BLOB_PATH, { token })
    return guide.size > 0 && guide.contentType === 'application/pdf'
  } catch {
    return false
  }
}

function paymentMatchesOrder(payment, paymentId, order) {
  return payment?.id === paymentId &&
    payment.order_id === order.id &&
    payment.amount === order.amount &&
    payment.currency === order.currency
}

async function capturePaymentIfNeeded(razorpay, payment, order) {
  if (payment.status !== 'authorized') return payment

  try {
    await razorpay.payments.capture(payment.id, order.amount, order.currency)
  } catch {
    // If automatic capture raced this request, the follow-up fetch will show captured.
  }
  return razorpay.payments.fetch(payment.id)
}

export async function createRazorpayOrder() {
  const config = getRazorpayConfig()
  if (!config) {
    return jsonResult(500, { error: 'Payment service is not configured on the server.' })
  }

  // Never create a payable order until the private PDF is ready to deliver.
  if (!(await guideIsAvailable())) {
    return jsonResult(503, { error: 'Secure guide delivery is not ready yet. Please try again later.' })
  }

  // The amount is fixed on the server so a browser cannot change the ₹9 price.
  const amount = PRODUCT_AMOUNT_PAISE
  if (!Number.isInteger(amount) || amount < 100) {
    return jsonResult(400, { error: 'The order amount must be at least 100 paise.' })
  }

  try {
    const razorpay = makeClient(config)
    const order = await razorpay.orders.create({
      amount,
      currency: PRODUCT_CURRENCY,
      receipt: `haircare_${randomUUID().replaceAll('-', '').slice(0, 16)}`,
    })

    return jsonResult(200, {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    if (isAuthenticationError(error)) {
      return jsonResult(401, { error: 'Razorpay rejected the server credentials.' })
    }
    return jsonResult(500, { error: 'Could not create a Razorpay order. Please try again.' })
  }
}

export async function verifyRazorpayPayment(payload) {
  const data = parsePayload(payload)
  const orderId = data?.razorpay_order_id
  const paymentId = data?.razorpay_payment_id
  const signature = data?.razorpay_signature

  if (
    typeof orderId !== 'string' || !/^order_[A-Za-z0-9]+$/.test(orderId) ||
    typeof paymentId !== 'string' || !/^pay_[A-Za-z0-9]+$/.test(paymentId) ||
    typeof signature !== 'string' || signature.length === 0
  ) {
    return jsonResult(400, { error: 'Payment ID, order ID and signature are required.' })
  }

  const config = getRazorpayConfig()
  if (!config) {
    return jsonResult(500, { error: 'Payment service is not configured on the server.' })
  }

  try {
    const razorpay = makeClient(config)
    const order = await razorpay.orders.fetch(orderId)
    if (order.id !== orderId || order.amount !== PRODUCT_AMOUNT_PAISE || order.currency !== PRODUCT_CURRENCY) {
      return jsonResult(400, { error: 'The Razorpay order does not match this product.' })
    }

    const expectedSignature = createHmac('sha256', config.keySecret)
      .update(`${order.id}|${paymentId}`)
      .digest('hex')

    if (!signaturesMatch(expectedSignature, signature)) {
      return jsonResult(400, { error: 'Payment signature verification failed.' })
    }

    let payment = await razorpay.payments.fetch(paymentId)
    if (!paymentMatchesOrder(payment, paymentId, order)) {
      return jsonResult(400, { error: 'The Razorpay payment does not match this order.' })
    }

    payment = await capturePaymentIfNeeded(razorpay, payment, order)
    if (!paymentMatchesOrder(payment, paymentId, order) || payment.status !== 'captured') {
      return jsonResult(409, { error: 'Payment is not captured yet. No download has been issued.' })
    }

    return jsonResult(200, {
      verified: true,
      captured: true,
      order_id: order.id,
      payment_id: paymentId,
      amount: order.amount,
      currency: order.currency,
      download_token: createDownloadToken(order.id, paymentId, config.keySecret),
    })
  } catch (error) {
    if (isAuthenticationError(error)) {
      return jsonResult(401, { error: 'Razorpay rejected the server credentials.' })
    }
    if (error?.statusCode === 400 || error?.statusCode === 404) {
      return jsonResult(400, { error: 'The Razorpay order or payment could not be validated.' })
    }
    return jsonResult(500, { error: 'Could not verify and capture the Razorpay payment. Please contact support.' })
  }
}

export async function authorizeGuideDownload(payload) {
  const tokenValue = parsePayload(payload)?.download_token
  const config = getRazorpayConfig()
  if (!config) {
    return jsonResult(500, { error: 'Payment service is not configured on the server.' })
  }

  const token = readDownloadToken(tokenValue, config.keySecret)
  if (!token) {
    return jsonResult(401, { error: 'This download link is invalid or expired. Contact the seller; do not pay again.' })
  }

  try {
    const razorpay = makeClient(config)
    const [order, payment] = await Promise.all([
      razorpay.orders.fetch(token.order_id),
      razorpay.payments.fetch(token.payment_id),
    ])

    if (
      order.id !== token.order_id || order.amount !== PRODUCT_AMOUNT_PAISE || order.currency !== PRODUCT_CURRENCY ||
      !paymentMatchesOrder(payment, token.payment_id, order) || payment.status !== 'captured'
    ) {
      return jsonResult(403, { error: 'The captured payment could not be confirmed for this download.' })
    }

    return jsonResult(200, { authorized: true })
  } catch (error) {
    if (isAuthenticationError(error)) {
      return jsonResult(401, { error: 'Razorpay rejected the server credentials.' })
    }
    if (error?.statusCode === 400 || error?.statusCode === 404) {
      return jsonResult(403, { error: 'The captured payment could not be confirmed for this download.' })
    }
    return jsonResult(500, { error: 'Could not validate the download. Please try again.' })
  }
}
