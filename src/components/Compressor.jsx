import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { zipSync } from 'fflate'
import {
  MAX_FILES,
  MAX_FILE_BYTES,
  compressImage,
  formatBytes,
  isImageFile,
  outputName,
} from '../lib/image.js'

const DEFAULTS = {
  format: 'original',
  quality: 80,
  targetOn: false,
  targetKb: 200,
  resize: { mode: 'none', width: '', height: '', lock: true, percent: 50 },
}

let uid = 0

function Segmented({ value, onChange, options, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-slate-100 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-2 py-1.5 text-sm font-medium transition ${
            value === o.value ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Field({ label, children, hint }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold text-slate-800">{label}</div>
      {children}
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{hint}</p>}
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 disabled:bg-slate-50 disabled:text-slate-400'

export default function Compressor() {
  const [items, setItems] = useState([])
  const [settings, setSettings] = useState(DEFAULTS)
  const [notice, setNotice] = useState('')
  const [dragging, setDragging] = useState(false)
  const [zipping, setZipping] = useState(false)
  const fileInput = useRef(null)
  const itemsRef = useRef(items)
  itemsRef.current = items
  const dragDepth = useRef(0)

  const patchSettings = (p) => setSettings((s) => ({ ...s, ...p }))
  const patchResize = (p) => setSettings((s) => ({ ...s, resize: { ...s.resize, ...p } }))

  /* ───────────── adding files ───────────── */
  const addFiles = useCallback((fileList, source = 'upload') => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    const problems = []
    const accepted = []
    const room = MAX_FILES - itemsRef.current.length
    for (const f of files) {
      if (!isImageFile(f)) problems.push(`“${f.name}” is not an image.`)
      else if (f.size > MAX_FILE_BYTES) problems.push(`“${f.name}” is larger than 50 MB.`)
      else if (accepted.length >= room) {
        if (!problems.some((p) => p.includes('limit'))) problems.push(`Limit of ${MAX_FILES} images reached.`)
      } else accepted.push(f)
    }
    setNotice(problems.slice(0, 3).join(' '))
    if (!accepted.length) return
    setItems((prev) => [
      ...prev,
      ...accepted.map((file) => {
        const n = ++uid
        const generic = source === 'paste' && /^image\.\w+$/i.test(file.name)
        const name = generic ? `pasted-image-${n}.${(file.type.split('/')[1] || 'png').replace('jpeg', 'jpg')}` : file.name
        return {
          id: n,
          file,
          name,
          size: file.size,
          previewUrl: URL.createObjectURL(file),
          status: 'queued',
          key: '',
          result: null,
          error: '',
        }
      }),
    ])
  }, [])

  /* ───────────── paste + window-wide drag & drop ───────────── */
  useEffect(() => {
    const onPaste = (e) => {
      const files = Array.from(e.clipboardData?.files || []).filter((f) => f.type.startsWith('image/'))
      if (files.length) {
        e.preventDefault()
        addFiles(files, 'paste')
      }
    }
    const hasFiles = (e) => Array.from(e.dataTransfer?.types || []).includes('Files')
    const onEnter = (e) => {
      if (!hasFiles(e)) return
      dragDepth.current++
      setDragging(true)
    }
    const onOver = (e) => {
      if (hasFiles(e)) e.preventDefault()
    }
    const onLeave = (e) => {
      if (!hasFiles(e)) return
      dragDepth.current = Math.max(0, dragDepth.current - 1)
      if (!dragDepth.current) setDragging(false)
    }
    const onDrop = (e) => {
      if (!hasFiles(e)) return
      e.preventDefault()
      dragDepth.current = 0
      setDragging(false)
      addFiles(e.dataTransfer.files, 'drop')
    }
    window.addEventListener('paste', onPaste)
    window.addEventListener('dragenter', onEnter)
    window.addEventListener('dragover', onOver)
    window.addEventListener('dragleave', onLeave)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('paste', onPaste)
      window.removeEventListener('dragenter', onEnter)
      window.removeEventListener('dragover', onOver)
      window.removeEventListener('dragleave', onLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [addFiles])

  async function pasteFromClipboard() {
    try {
      const clip = await navigator.clipboard.read()
      const files = []
      for (const c of clip) {
        const type = c.types.find((t) => t.startsWith('image/'))
        if (type) files.push(new File([await c.getType(type)], 'image.' + type.split('/')[1], { type }))
      }
      if (files.length) addFiles(files, 'paste')
      else setNotice('No image found on your clipboard. Copy an image first, then try again.')
    } catch {
      setNotice('Your browser blocked clipboard access. Press Ctrl+V (or ⌘+V) anywhere on this page instead.')
    }
  }

  /* ───────────── processing queue ───────────── */
  const settingsKey = JSON.stringify(settings)
  const idsKey = items.map((i) => i.id).join(',')

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      for (const it of itemsRef.current) {
        if (cancelled) return
        if (it.key === settingsKey && (it.status === 'done' || it.status === 'error')) continue
        setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: 'processing' } : p)))
        let patch
        try {
          const r = await compressImage(it.file, settings)
          const url = URL.createObjectURL(r.blob)
          patch = {
            status: 'done',
            key: settingsKey,
            error: '',
            result: {
              ...r,
              url,
              size: r.blob.size,
              name: outputName(it.name, r.mime, r.alreadyOptimal),
            },
          }
        } catch (err) {
          patch = {
            status: 'error',
            key: settingsKey,
            error: err?.message || 'This image could not be processed. The file may be corrupted or in an unsupported format.',
            result: null,
          }
        }
        setItems((prev) =>
          prev.map((p) => {
            if (p.id !== it.id) return p
            if (p.result?.url) URL.revokeObjectURL(p.result.url)
            return { ...p, ...patch }
          }),
        )
      }
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsKey, idsKey])

  // Release object URLs on unmount
  useEffect(
    () => () => {
      itemsRef.current.forEach((i) => {
        URL.revokeObjectURL(i.previewUrl)
        if (i.result?.url) URL.revokeObjectURL(i.result.url)
      })
    },
    [],
  )

  function removeItem(id) {
    setItems((prev) => {
      const it = prev.find((p) => p.id === id)
      if (it) {
        URL.revokeObjectURL(it.previewUrl)
        if (it.result?.url) URL.revokeObjectURL(it.result.url)
      }
      return prev.filter((p) => p.id !== id)
    })
  }

  function clearAll() {
    items.forEach((it) => {
      URL.revokeObjectURL(it.previewUrl)
      if (it.result?.url) URL.revokeObjectURL(it.result.url)
    })
    setItems([])
    setNotice('')
  }

  async function downloadZip() {
    setZipping(true)
    try {
      const files = {}
      const used = new Set()
      for (const it of items) {
        if (!it.result) continue
        let name = it.result.name
        for (let n = 2; used.has(name); n++) name = it.result.name.replace(/(\.[^.]+)$/, `-${n}$1`)
        used.add(name)
        files[name] = new Uint8Array(await it.result.blob.arrayBuffer())
      }
      const zip = zipSync(files, { level: 0 })
      const url = URL.createObjectURL(new Blob([zip], { type: 'application/zip' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'compressed-images.zip'
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    } finally {
      setZipping(false)
    }
  }

  /* ───────────── totals ───────────── */
  const totals = useMemo(() => {
    const done = items.filter((i) => i.result)
    const before = done.reduce((s, i) => s + i.size, 0)
    const after = done.reduce((s, i) => s + i.result.size, 0)
    return { count: done.length, before, after, pct: before ? Math.round((1 - after / before) * 100) : 0 }
  }, [items])

  const busy = items.some((i) => i.status === 'queued' || i.status === 'processing')
  const lossy = settings.format !== 'image/png'
  const r = settings.resize

  /* ───────────── render ───────────── */
  return (
    <section id="tool" aria-label="Image compressor and resizer tool" className="scroll-mt-20">
      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-teal-900/70 p-6 backdrop-blur-sm">
          <div className="rounded-3xl border-4 border-dashed border-white/80 px-10 py-14 text-center text-2xl font-semibold text-white">
            Drop your images to compress them
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* LEFT: drop zone + results */}
        <div className="min-w-0 space-y-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInput.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), fileInput.current?.click())}
            aria-label="Choose images, or drag and drop or paste them here"
            className={`group cursor-pointer rounded-3xl border-2 border-dashed border-teal-300 bg-gradient-to-b from-teal-50 to-white text-center transition hover:border-teal-500 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/30 ${
              items.length ? 'px-6 py-6' : 'px-6 py-14 sm:py-20'
            }`}
          >
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/30 transition group-hover:scale-105">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 16V4M7 9l5-5 5 5" />
                <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {items.length ? 'Add more images' : 'Drop images here, or click to browse'}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              or press <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs font-semibold">Ctrl</kbd> +{' '}
              <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs font-semibold">V</kbd> to paste a screenshot or copied image
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInput.current?.click()
                }}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/30"
              >
                Select images
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  pasteFromClipboard()
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/30"
              >
                Paste from clipboard
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">JPG, PNG, WebP, GIF, BMP, AVIF · up to {MAX_FILES} images · 50 MB each</p>
          </div>

          <p role="status" aria-live="polite" className={notice ? 'rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200' : 'sr-only'}>
            {notice}
          </p>

          {items.length > 0 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-white">
                <div className="text-sm">
                  {busy ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                      Compressing…
                    </span>
                  ) : (
                    <>
                      <strong className="font-semibold">{totals.count}</strong> image{totals.count === 1 ? '' : 's'} ·{' '}
                      {formatBytes(totals.before)} → <strong className="font-semibold">{formatBytes(totals.after)}</strong>{' '}
                      <span className={totals.pct > 0 ? 'font-semibold text-emerald-300' : 'text-slate-300'}>
                        ({totals.pct > 0 ? `−${totals.pct}%` : 'no savings'})
                      </span>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    disabled={busy || zipping || !totals.count}
                    onClick={downloadZip}
                    className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {zipping ? 'Zipping…' : items.length > 1 ? 'Download all (ZIP)' : 'Download ZIP'}
                  </button>
                </div>
              </div>

              <ul className="space-y-3">
                {items.map((it) => {
                  const res = it.result
                  const saved = res ? Math.round((1 - res.size / it.size) * 100) : 0
                  return (
                    <li key={it.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[conic-gradient(#e2e8f0_25%,#f8fafc_0_50%,#e2e8f0_0_75%,#f8fafc_0)] bg-[length:16px_16px] sm:h-24 sm:w-24">
                        <img src={it.previewUrl} alt={`Preview of ${it.name}`} className="h-full w-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900" title={it.name}>
                            {it.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(it.id)}
                            aria-label={`Remove ${it.name}`}
                            className="-m-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                              <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                          </button>
                        </div>

                        {it.status === 'error' ? (
                          <p className="mt-1 text-sm text-red-600">{it.error}</p>
                        ) : res ? (
                          <>
                            <p className="mt-1 text-sm text-slate-600">
                              {formatBytes(it.size)} → <strong className="text-slate-900">{formatBytes(res.size)}</strong>{' '}
                              {res.alreadyOptimal ? (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">already optimized</span>
                              ) : saved > 0 ? (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">−{saved}%</span>
                              ) : (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">+{Math.abs(saved)}%</span>
                              )}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {res.origWidth}×{res.origHeight}
                              {(res.width !== res.origWidth || res.height !== res.origHeight) && <> → {res.width}×{res.height}</>} ·{' '}
                              {res.mime.replace('image/', '').replace('jpeg', 'JPG').toUpperCase()}
                            </p>
                            <a
                              href={res.url}
                              download={res.name}
                              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />
                              </svg>
                              Download
                            </a>
                          </>
                        ) : (
                          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" aria-hidden="true" />
                            Processing…
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            100% private: images are processed in your browser and never uploaded to any server.
          </p>
        </div>

        {/* RIGHT: settings */}
        <aside aria-label="Compression settings" className="space-y-5 self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-20">
          <h2 className="text-base font-bold text-slate-900">Settings</h2>

          <Field label="Output format">
            <Segmented
              label="Output format"
              value={settings.format}
              onChange={(v) => patchSettings({ format: v })}
              options={[
                { value: 'original', label: 'Keep' },
                { value: 'image/jpeg', label: 'JPG' },
                { value: 'image/webp', label: 'WebP' },
                { value: 'image/png', label: 'PNG' },
              ]}
            />
          </Field>

          <Field
            label={
              <span className="flex items-center justify-between">
                <span>Quality</span>
                <span className="font-mono text-teal-700">{lossy ? `${settings.quality}%` : 'lossless'}</span>
              </span>
            }
            hint={lossy ? '70–85% is the sweet spot: big savings, no visible difference.' : 'PNG is lossless, so quality does not apply. Resize it or switch to WebP/JPG for much smaller files.'}
          >
            <input
              type="range"
              min="1"
              max="100"
              value={settings.quality}
              disabled={!lossy || (settings.targetOn && lossy)}
              onChange={(e) => patchSettings({ quality: Number(e.target.value) })}
              aria-label="Quality"
              className="w-full accent-teal-600 disabled:opacity-40"
            />
          </Field>

          <div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={settings.targetOn}
                disabled={!lossy}
                onChange={(e) => patchSettings({ targetOn: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 accent-teal-600"
              />
              Target a maximum file size
            </label>
            {settings.targetOn && lossy && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  inputMode="numeric"
                  value={settings.targetKb}
                  onChange={(e) => patchSettings({ targetKb: e.target.value })}
                  aria-label="Maximum file size in kilobytes"
                  className={inputCls}
                />
                <span className="text-sm text-slate-500">KB</span>
              </div>
            )}
          </div>

          <Field label="Resize">
            <Segmented
              label="Resize mode"
              value={r.mode}
              onChange={(v) => patchResize({ mode: v })}
              options={[
                { value: 'none', label: 'Original' },
                { value: 'dimensions', label: 'Pixels' },
                { value: 'percent', label: 'Percent' },
              ]}
            />
            {r.mode === 'dimensions' && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-medium text-slate-600">
                    Width (px)
                    <input type="number" min="1" inputMode="numeric" placeholder="auto" value={r.width} onChange={(e) => patchResize({ width: e.target.value })} className={`${inputCls} mt-1`} />
                  </label>
                  <label className="text-xs font-medium text-slate-600">
                    Height (px)
                    <input type="number" min="1" inputMode="numeric" placeholder="auto" value={r.height} onChange={(e) => patchResize({ height: e.target.value })} className={`${inputCls} mt-1`} />
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[1920, 1280, 1080, 800, 400].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => patchResize({ width: String(w), height: '' })}
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-teal-500 hover:text-teal-700"
                    >
                      {w}px wide
                    </button>
                  ))}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={r.lock} onChange={(e) => patchResize({ lock: e.target.checked })} className="h-4 w-4 rounded border-slate-300 accent-teal-600" />
                  Keep aspect ratio
                </label>
                <p className="text-xs leading-relaxed text-slate-500">
                  {r.lock ? 'Images are scaled to fit inside the width/height you set without distortion.' : 'With both values set, every image is stretched to exactly this size.'}
                </p>
              </div>
            )}
            {r.mode === 'percent' && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Scale to</span>
                  <span className="font-mono text-teal-700">{r.percent}%</span>
                </div>
                <input type="range" min="5" max="200" step="5" value={r.percent} onChange={(e) => patchResize({ percent: Number(e.target.value) })} aria-label="Scale percentage" className="w-full accent-teal-600" />
                <div className="flex gap-1.5">
                  {[75, 50, 25].map((p) => (
                    <button key={p} type="button" onClick={() => patchResize({ percent: p })} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-teal-500 hover:text-teal-700">
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Field>

          <button type="button" onClick={() => setSettings(DEFAULTS)} className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline">
            Reset settings
          </button>
        </aside>
      </div>
    </section>
  )
}
