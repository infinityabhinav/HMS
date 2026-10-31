import { get } from '@vercel/blob'
import { authorizeGuideDownload } from './razorpay.js'

const GUIDE_BLOB_PATH = 'hair-fall-control-guide.pdf'
const GUIDE_FILENAME = 'hair-fall-control-guide.pdf'

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export async function downloadGuideResponse(request) {
  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' })
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return jsonResponse(400, { error: 'A valid download token is required.' })
  }

  const authorization = await authorizeGuideDownload(payload)
  if (authorization.statusCode !== 200) {
    return jsonResponse(authorization.statusCode, authorization.body)
  }

  try {
    const guide = await get(GUIDE_BLOB_PATH, {
      access: 'private',
      useCache: false,
    })

    if (!guide || guide.statusCode !== 200 || guide.blob.contentType !== 'application/pdf') {
      return jsonResponse(503, { error: 'The guide is temporarily unavailable. Please retry your download.' })
    }

    return new Response(guide.stream, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${GUIDE_FILENAME}"`,
        'Content-Length': String(guide.blob.size),
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return jsonResponse(503, { error: 'The guide is temporarily unavailable. Please retry your download.' })
  }
}
