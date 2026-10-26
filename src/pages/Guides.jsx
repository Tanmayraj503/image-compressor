import { Link, useParams } from 'react-router-dom'
import { getGuide, guides } from '../content/guides.js'
import AdSlot from '../components/AdSlot.jsx'
import NotFound from './NotFound.jsx'

const fmt = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

export function GuidesIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Image optimization guides</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Practical, plain-English tutorials on making images smaller, sharper and faster, for websites, social media and everyday sharing.
      </p>
      <div className="mt-8 grid gap-5">
        {guides.map((g) => (
          <Link key={g.slug} to={`/guides/${g.slug}/`} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-400 hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700">{g.readMinutes} min read · {fmt(g.date)}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{g.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{g.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function GuideArticle() {
  const { slug } = useParams()
  const g = getGuide(slug)
  if (!g) return <NotFound />
  const others = guides.filter((x) => x.slug !== g.slug).slice(0, 3)
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link to="/" className="hover:text-teal-700">Home</Link> / <Link to="/guides/" className="hover:text-teal-700">Guides</Link>
      </nav>
      <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{g.title}</h1>
      <p className="mt-3 text-sm text-slate-500">
        <time dateTime={g.date}>{fmt(g.date)}</time> · {g.readMinutes} min read
      </p>
      <div className="prose prose-slate mt-8 max-w-none prose-headings:tracking-tight prose-a:text-teal-700">
        <p className="lead">{g.intro}</p>
        {g.sections.map((s, i) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p?.map((t, j) => <p key={j}>{t}</p>)}
            {s.list && <ul>{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
            {s.table && (
              <div className="overflow-x-auto">
                <table>
                  <thead><tr>{s.table.head.map((h, k) => <th key={k}>{h}</th>)}</tr></thead>
                  <tbody>{s.table.rows.map((r, k) => <tr key={k}>{r.map((c, m) => (m === 0 ? <th key={m} scope="row">{c}</th> : <td key={m}>{c}</td>))}</tr>)}</tbody>
                </table>
              </div>
            )}
            {i === 1 && <AdSlot slot="inContent" className="not-prose" />}
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-teal-50 p-6 ring-1 ring-teal-100">
        <h2 className="text-lg font-bold text-slate-900">Try it yourself</h2>
        <p className="mt-1 text-sm text-slate-600">Compress and resize your images for free: no uploads, everything happens in your browser.</p>
        <Link to="/" className="mt-4 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">Open the image compressor</Link>
      </div>

      <AdSlot slot="footer" />

      <h2 className="mt-12 text-xl font-bold text-slate-900">Keep reading</h2>
      <ul className="mt-4 space-y-3">
        {others.map((o) => (
          <li key={o.slug}><Link className="font-medium text-teal-700 hover:underline" to={`/guides/${o.slug}/`}>{o.title}</Link></li>
        ))}
      </ul>
    </article>
  )
}
