import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import site from '../site.config.js'
import Seo from './Seo.jsx'

export function Logo({ className = 'h-8 w-8' }) {
  return <img src="/favicon.svg" alt="" width="32" height="32" className={className} />
}

const nav = [
  { to: '/', label: 'Compressor', end: true },
  { to: '/guides/', label: 'Guides' },
  { to: '/about/', label: 'About' },
  { to: '/contact/', label: 'Contact' },
]

export default function Layout({ noindex }) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Seo noindex={noindex} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-900">
            <Logo />
            {site.name}
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1 text-sm font-medium">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `rounded-lg px-2.5 py-1.5 sm:px-3 ${isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900">
              <Logo className="h-7 w-7" />
              {site.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
              Free, private image compression and resizing that runs entirely in your browser.
            </p>
          </div>
          <nav aria-label="Tools and guides">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Explore</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link className="hover:text-teal-700" to="/">Image compressor</Link></li>
              <li><Link className="hover:text-teal-700" to="/guides/">Guides</Link></li>
              <li><Link className="hover:text-teal-700" to="/about/">About us</Link></li>
              <li><Link className="hover:text-teal-700" to="/contact/">Contact</Link></li>
            </ul>
          </nav>
          <nav aria-label="Legal">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Legal</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link className="hover:text-teal-700" to="/privacy-policy/">Privacy Policy</Link></li>
              <li><Link className="hover:text-teal-700" to="/terms/">Terms of Service</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {site.owner}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
