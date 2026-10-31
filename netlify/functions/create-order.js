import { createRazorpayOrder } from '../../server/razorpay.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ error: 'Method not allowed.' }),
    }
  }

  const result = await createRazorpayOrder()
  return {
    statusCode: result.statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(result.body),
  }
}
