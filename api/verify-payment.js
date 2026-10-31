import { verifyRazorpayPayment } from '../server/razorpay.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const result = await verifyRazorpayPayment(request.body)
  response.setHeader('Cache-Control', 'no-store')
  return response.status(result.statusCode).json(result.body)
}
