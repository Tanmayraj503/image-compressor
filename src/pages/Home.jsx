import { Link } from 'react-router-dom'
import Compressor from '../components/Compressor.jsx'
import AdSlot from '../components/AdSlot.jsx'
import { faq } from '../content/faq.js'
import { guides } from '../content/guides.js'
import site from '../site.config.js'

const features = [
  { t: 'Private by design', d: 'Everything runs in your browser. Your photos never leave your device and are never uploaded.' },
  { t: 'Compress & resize together', d: 'Shrink file size and change dimensions in one step, by pixels, percentage or a target file size in KB.' },
  { t: 'Batch processing', d: 'Handle up to 50 images at once and download them all as one ZIP file.' },
  { t: 'Drag, drop or paste', d: 'Drop files anywhere on the page, browse for them, or paste a screenshot straight from your clipboard.' },
  { t: 'JPG, PNG & WebP output', d: 'Convert between formats to find the smallest file. WebP often beats JPG by 25–35%.' },
  { t: 'Fast and free', d: 'No sign-up, no watermarks and no daily limits. Results appear instantly as you adjust the settings.' },
]

const steps = [
  { t: 'Add your images', d: 'Drag and drop files onto the page, click to browse, or press Ctrl+V to paste an image from your clipboard.' },
  { t: 'Choose your settings', d: 'Pick an output format, set the quality (80% is a great start) and optionally resize by pixels or percentage.' },
  { t: 'Download the result', d: 'Compare the before and after sizes, then download each image or grab everything as a ZIP.' },
]

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-teal-50 via-white to-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:pt-14">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Free Image Compressor <span className="text-teal-600">&amp; Resizer</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Reduce the file size of JPG, PNG and WebP images by up to 90% and resize them to any dimension, directly in your browser. No uploads, no sign-up.
            </p>
          </div>
          <Compressor />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <AdSlot slot="inContent" />

        <section aria-labelledby="how" className="py-10">
          <h2 id="how" className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">How to compress an image online</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="features" className="py-10">
          <h2 id="features" className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">Why use {site.name}?</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.t} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-slate-900">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="why" className="mx-auto max-w-3xl py-10">
          <h2 id="why" className="text-2xl font-bold text-slate-900 sm:text-3xl">Why compress and resize images?</h2>
          <div className="prose prose-slate mt-4 max-w-none prose-a:text-teal-700">
            <p>
              Modern cameras and phones produce photos of several megabytes each. That is wonderful for printing, but far more than a website, an email or a chat message needs. Large images slow down page loads, eat mobile data, fill up storage and often exceed the upload limits of forms and marketplaces.
            </p>
            <p>
              Compressing an image removes data the eye barely notices, while resizing changes the number of pixels so the picture matches the space it is shown in. Used together, they routinely turn a 5 MB photo into a 200–400 KB file that looks identical on screen. For websites this improves loading speed and Core Web Vitals; for everyday use it means faster sharing and fewer “file too large” errors.
            </p>
            <p>
              Not sure which settings to pick? Start with WebP or JPG at 80% quality, resize to the width you actually need, and compare. Our{' '}
              <Link to="/guides/how-to-compress-images-without-losing-quality/">guide to compressing images without losing quality</Link> walks through the process, and{' '}
              <Link to="/guides/jpeg-vs-png-vs-webp/">JPEG vs PNG vs WebP</Link> helps you choose the right format.
            </p>
          </div>
        </section>

        <section aria-labelledby="faq" className="mx-auto max-w-3xl py-10">
          <h2 id="faq" className="text-2xl font-bold text-slate-900 sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                  {f.q}
                  <span className="text-teal-600 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <AdSlot slot="footer" />

        <section aria-labelledby="learn" className="py-10 pb-16">
          <div className="flex items-end justify-between">
            <h2 id="learn" className="text-2xl font-bold text-slate-900 sm:text-3xl">Learn image optimization</h2>
            <Link to="/guides/" className="text-sm font-semibold text-teal-700 hover:underline">All guides →</Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {guides.slice(0, 2).map((g) => (
              <Link key={g.slug} to={`/guides/${g.slug}/`} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-400 hover:shadow-md">
                <h3 className="font-semibold text-slate-900">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{g.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
