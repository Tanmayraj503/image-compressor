import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { canonicalFor, findRoute, normalize } from '../meta.js'

function setMeta(selector, attr, value, create) {
  let el = document.head.querySelector(selector)
  if (!el && create) {
    el = document.createElement('meta')
    Object.entries(create).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
  if (el) el.setAttribute(attr, value)
}

/** Keeps <title>, description, canonical, OG/Twitter and robots in sync on client-side navigation. */
export default function Seo({ noindex = false }) {
  const { pathname } = useLocation()
  useEffect(() => {
    const route = findRoute(pathname)
    const title = route?.title ?? 'Page not found'
    const desc = route?.description ?? ''
    const url = canonicalFor(route ? route.path : normalize(pathname))
    document.title = title
    setMeta('meta[name="description"]', 'content', desc, { name: 'description' })
    setMeta('meta[name="robots"]', 'content', noindex || !route ? 'noindex,follow' : 'index,follow,max-image-preview:large', { name: 'robots' })
    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
    setMeta('meta[property="og:title"]', 'content', title, { property: 'og:title' })
    setMeta('meta[property="og:description"]', 'content', desc, { property: 'og:description' })
    setMeta('meta[property="og:url"]', 'content', url, { property: 'og:url' })
    setMeta('meta[name="twitter:title"]', 'content', title, { name: 'twitter:title' })
    setMeta('meta[name="twitter:description"]', 'content', desc, { name: 'twitter:description' })
  }, [pathname, noindex])
  return null
}
