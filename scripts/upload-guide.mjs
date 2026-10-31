import { readFile } from 'node:fs/promises'
import { put } from '@vercel/blob'

const sourcePath = process.argv[2]
const token = process.env.BLOB_READ_WRITE_TOKEN

if (!sourcePath) {
  throw new Error('Usage: node --env-file=.env scripts/upload-guide.mjs <path-to-guide.pdf>')
}

if (!token) {
  throw new Error('BLOB_READ_WRITE_TOKEN is missing. Add the private Blob store token to your ignored local .env file.')
}

const pdf = await readFile(sourcePath)
if (pdf.length < 5 || !pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
  throw new Error('The selected file is not a valid PDF.')
}

const blob = await put('hair-fall-control-guide.pdf', pdf, {
  access: 'private',
  token,
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: 'application/pdf',
  cacheControlMaxAge: 60,
})

console.log(`Uploaded the guide to private Vercel Blob storage as ${blob.pathname}.`)
