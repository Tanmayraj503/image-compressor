// Generates all favicon / PWA / social-preview rasters from public/favicon.svg
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = (f) => path.join(root, 'public', f)
const svg = readFileSync(pub('favicon.svg'))
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()

const sizes = { 'favicon-16x16.png': 16, 'favicon-32x32.png': 32, 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512 }
for (const [file, size] of Object.entries(sizes)) writeFileSync(pub(file), await png(size))

// favicon.ico (PNG-compressed entries: 16, 32, 48)
const ico = [16, 32, 48]
const imgs = await Promise.all(ico.map(png))
const head = Buffer.alloc(6)
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(ico.length, 4)
let offset = 6 + 16 * ico.length
const dir = imgs.map((buf, i) => {
  const e = Buffer.alloc(16)
  e.writeUInt8(ico[i], 0); e.writeUInt8(ico[i], 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3)
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12)
  offset += buf.length
  return e
})
writeFileSync(pub('favicon.ico'), Buffer.concat([head, ...dir, ...imgs]))

// 1200x630 social preview card
const site = (await import(path.join(root, 'src/site.config.js'))).default
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f766e"/><stop offset="1" stop-color="#134e4a"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#b)"/>
  <g transform="translate(90 90) scale(2.2)"><rect width="64" height="64" rx="14" fill="#fff" fill-opacity="0.15"/>
    <g transform="translate(10 10) scale(1.8)" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></g></g>
  <text x="90" y="360" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="84" fill="#fff">${esc(site.name)}</text>
  <text x="90" y="440" font-family="DejaVu Sans, Arial, sans-serif" font-size="46" fill="#99f6e4">${esc(site.tagline)}</text>
  <text x="90" y="530" font-family="DejaVu Sans, Arial, sans-serif" font-size="30" fill="#ccfbf1">Compress &amp; resize JPG, PNG, WebP · 100% private · No uploads</text>
</svg>`
writeFileSync(pub('og-image.png'), await sharp(Buffer.from(og)).png().toBuffer())
console.log('icons generated')
