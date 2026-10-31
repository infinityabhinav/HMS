import Razorpay from 'razorpay'
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const PRODUCT_AMOUNT_PAISE = 900
const PRODUCT_CURRENCY = 'INR'

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

export async function createRazorpayOrder() {
  const config = getRazorpayConfig()
  if (!config) {
    return jsonResult(500, { error: 'Payment service is not configured on the server.' })
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
    // Fetch the order from Razorpay so verification uses a server-confirmed order ID.
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

    return jsonResult(200, {
      verified: true,
      order_id: order.id,
      payment_id: paymentId,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    if (isAuthenticationError(error)) {
      return jsonResult(401, { error: 'Razorpay rejected the server credentials.' })
    }
    if (error?.statusCode === 400 || error?.statusCode === 404) {
      return jsonResult(400, { error: 'The Razorpay order could not be validated.' })
    }
    return jsonResult(500, { error: 'Could not verify the Razorpay payment. Please contact support.' })
  }
}
