// Turns the single-page build into crawler-friendly static output:
//  • one HTML file per route with its own <title>, description, canonical, OG tags & JSON-LD
//  • sitemap.xml, robots.txt, ads.txt, site.webmanifest, 404.html
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const load = async (p) => import(pathToFileURL(path.join(root, p)).href)

const site = (await load('src/site.config.js')).default
const { routes, canonicalFor } = await load('src/meta.js')
const { faq } = await load('src/content/faq.js')

if (/example\.com/.test(site.url)) {
  console.warn('\n⚠  site.config.js still uses https://www.example.com — set your real domain before deploying.\n')
}

const template = readFileSync(path.join(dist, 'index.html'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const json = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`
const ogImage = `${site.url}/og-image.png`

function headExtra(route) {
  const out = []
  if (site.searchConsoleToken) out.push(`<meta name="google-site-verification" content="${esc(site.searchConsoleToken)}" />`)
  if (site.adsense.client) {
    out.push(`<meta name="google-adsense-account" content="${esc(site.adsense.client)}" />`)
    out.push(`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(site.adsense.client)}" crossorigin="anonymous"></script>`)
  }
  const org = { '@type': 'Organization', name: site.owner, url: site.url, logo: `${site.url}/icon-512.png` }
  if (route.path === '/') {
    out.push(json({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', name: site.name, url: site.url + '/', publisher: org },
        {
          '@type': 'WebApplication',
          name: `${site.name} – ${site.tagline}`,
          url: site.url + '/',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Any (web browser)',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description: route.description,
        },
        {
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
      ],
    }))
  } else if (route.article) {
    const a = route.article
    out.push(json({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.description,
      datePublished: a.date,
      dateModified: a.date,
      image: ogImage,
      author: org,
      publisher: org,
      mainEntityOfPage: canonicalFor(route.path),
    }))
  }
  if (route.path !== '/') {
    const crumbs = [{ n: 'Home', u: site.url + '/' }]
    if (route.path.startsWith('/guides/')) crumbs.push({ n: 'Guides', u: site.url + '/guides/' })
    if (route.path !== '/guides/' && !route.article) crumbs.length = 1
    crumbs.push({ n: route.title.split(' | ')[0], u: canonicalFor(route.path) })
    out.push(json({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.n, item: c.u })),
    }))
  }
  return out.join('\n    ')
}

const noscript = (route) =>
  `<noscript><div style="max-width:720px;margin:40px auto;padding:0 16px;font-family:system-ui,sans-serif"><h1>${esc(site.name)}: ${esc(site.tagline)}</h1><p>${esc(route.description)}</p><p>This tool needs JavaScript to compress images in your browser. Please enable JavaScript to continue.</p><p><a href="/">Compressor</a> · <a href="/guides/">Guides</a> · <a href="/about/">About</a> · <a href="/contact/">Contact</a> · <a href="/privacy-policy/">Privacy Policy</a> · <a href="/terms/">Terms</a></p></div></noscript>`

function render(route, { noindex = false } = {}) {
  let html = template
    .replaceAll('__TITLE__', esc(route.title))
    .replaceAll('__DESC__', esc(route.description))
    .replaceAll('__CANON__', esc(canonicalFor(route.path)))
    .replaceAll('__SITE_NAME__', esc(site.name))
    .replaceAll('__OG_TYPE__', route.article ? 'article' : 'website')
    .replaceAll('__OG_IMAGE__', esc(ogImage))
    .replace('<!--__HEAD_EXTRA__-->', headExtra(route))
    .replace('<!--__NOSCRIPT__-->', noscript(route))
  if (noindex) html = html.replace('content="index,follow,max-image-preview:large"', 'content="noindex,follow"').replace(/<link rel="canonical"[^>]*>\s*/, '')
  return html
}

for (const route of routes) {
  const dir = route.path === '/' ? dist : path.join(dist, route.path)
  mkdirSync(dir, { recursive: true })
  writeFileSync(path.join(dir, 'index.html'), render(route))
}
writeFileSync(path.join(dist, '404.html'), render({ path: '/404/', title: `Page not found | ${site.name}`, description: 'This page does not exist.' }, { noindex: true }))

const today = new Date().toISOString().slice(0, 10)
const urlset = routes
  .map((r) => `  <url>\n    <loc>${canonicalFor(r.path)}</loc>\n    <lastmod>${r.article?.date > today ? today : r.article?.date || today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`)
  .join('\n')
writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`)
writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)

if (site.adsense.client) {
  const pub = site.adsense.client.replace(/^ca-/, '')
  writeFileSync(path.join(dist, 'ads.txt'), `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`)
} else {
  console.warn('ℹ  adsense.client is empty: ads.txt and the AdSense snippet were NOT generated.')
}

writeFileSync(path.join(dist, 'site.webmanifest'), JSON.stringify({
  name: `${site.name}: ${site.tagline}`,
  short_name: site.name,
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#0f766e',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2))

console.log(`postbuild: ${routes.length} pages + 404.html, sitemap.xml, robots.txt, site.webmanifest`)
