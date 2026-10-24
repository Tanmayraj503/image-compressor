// Pure client-side image helpers. Nothing here ever uploads a file.

export const MAX_FILE_BYTES = 50 * 1024 * 1024
export const MAX_FILES = 50
const MAX_SIDE = 16384

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '–'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

let webpOk
function webpSupported() {
  if (webpOk === undefined) {
    try {
      webpOk = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')
    } catch {
      webpOk = false
    }
  }
  return webpOk
}

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

export function resolveMime(file, format) {
  if (format !== 'original') return format === 'image/webp' && !webpSupported() ? 'image/jpeg' : format
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return file.type
  return webpSupported() ? 'image/webp' : 'image/jpeg' // gif, bmp, avif, svg …
}

export function isImageFile(file) {
  return file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|avif|svg|heic)$/i.test(file.name)
}

async function decode(file) {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() }
  } catch {
    // Fallback (e.g. SVG, or browsers without createImageBitmap options)
    const url = URL.createObjectURL(file)
    try {
      const img = new Image()
      img.src = url
      await img.decode()
      return {
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        close: () => {},
      }
    } finally {
      URL.revokeObjectURL(url)
    }
  }
}

export function computeSize(w, h, r) {
  let nw = w
  let nh = h
  if (r.mode === 'percent') {
    const f = Math.min(Math.max(Number(r.percent) || 100, 1), 500) / 100
    nw = w * f
    nh = h * f
  } else if (r.mode === 'dimensions') {
    const tw = parseInt(r.width, 10) || 0
    const th = parseInt(r.height, 10) || 0
    if (tw || th) {
      if (!r.lock && tw && th) {
        nw = tw
        nh = th
      } else {
        const f = tw && th ? Math.min(tw / w, th / h) : tw ? tw / w : th / h
        nw = w * f
        nh = h * f
      }
    }
  }
  const clamp = (n) => Math.min(MAX_SIDE, Math.max(1, Math.round(n)))
  return [clamp(nw), clamp(nh)]
}

const toBlob = (canvas, mime, q) => new Promise((res) => canvas.toBlob(res, mime, q))

export async function compressImage(file, settings) {
  const dec = await decode(file)
  try {
    const mime = resolveMime(file, settings.format)
    const [w, h] = computeSize(dec.width, dec.height, settings.resize)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff' // JPEG has no alpha channel
      ctx.fillRect(0, 0, w, h)
    }
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(dec.source, 0, 0, w, h)

    const lossy = mime !== 'image/png'
    let blob
    if (lossy && settings.targetOn && Number(settings.targetKb) > 0) {
      const target = Number(settings.targetKb) * 1024
      let lo = 0.05
      let hi = 0.95
      let best = await toBlob(canvas, mime, lo)
      if (best.size <= target) {
        for (let i = 0; i < 7; i++) {
          const mid = (lo + hi) / 2
          const b = await toBlob(canvas, mime, mid)
          if (b.size <= target) {
            best = b
            lo = mid
          } else hi = mid
        }
      }
      blob = best
    } else {
      blob = await toBlob(canvas, mime, lossy ? settings.quality / 100 : undefined)
    }
    if (!blob) throw new Error('Your browser could not encode this image.')

    const resized = w !== dec.width || h !== dec.height
    const sameFormat = mime === file.type
    // Never hand back something larger than the original when nothing was asked of us.
    if (!resized && sameFormat && blob.size >= file.size && !settings.targetOn) {
      return {
        blob: file,
        width: dec.width,
        height: dec.height,
        mime,
        origWidth: dec.width,
        origHeight: dec.height,
        alreadyOptimal: true,
      }
    }
    return { blob, width: w, height: h, mime: blob.type || mime, origWidth: dec.width, origHeight: dec.height }
  } finally {
    dec.close()
  }
}

export function outputName(name, mime, alreadyOptimal) {
  const base = name.replace(/\.[^.]+$/, '')
  const ext = EXT[mime] || 'img'
  return alreadyOptimal ? `${base}.${ext}` : `${base}-compressed.${ext}`
}
