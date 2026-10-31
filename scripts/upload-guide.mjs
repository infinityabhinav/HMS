import { readFile } from 'node:fs/promises'
import { put } from '@vercel/blob'

const sourcePath = process.argv[2]

if (!sourcePath) {
  throw new Error('Usage: node --env-file=.env.local scripts/upload-guide.mjs <path-to-guide.pdf>')
}

const pdf = await readFile(sourcePath)
if (pdf.length < 5 || !pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
  throw new Error('The selected file is not a valid PDF.')
}

const blob = await put('hairfallguide.pdf', pdf, {
  access: 'private',
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: 'application/pdf',
  cacheControlMaxAge: 60,
})

console.log(`Uploaded the guide to private Vercel Blob storage as ${blob.pathname}.`)
