// Single source of truth for page titles/descriptions. Used by the <Seo/> component
// at runtime AND by scripts/postbuild.mjs to pre-render per-page HTML, sitemap & robots.
import site from './site.config.js'
import { guides } from './content/guides.js'

export const routes = [
  {
    path: '/',
    title: `${site.name}: Free Image Compressor & Resizer Online`,
    description:
      'Compress and resize JPG, PNG and WebP images online for free. Drag & drop or paste, shrink file size up to 90% with no visible quality loss. 100% private: files never leave your browser.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/guides/',
    title: `Image Optimization Guides & Tutorials | ${site.name}`,
    description:
      'Practical guides on compressing images, choosing between JPEG, PNG and WebP, picking the right dimensions and optimizing images for SEO and page speed.',
    priority: '0.8',
    changefreq: 'weekly',
  },
  ...guides.map((g) => ({
    path: `/guides/${g.slug}/`,
    title: `${g.title} | ${site.name}`,
    description: g.description,
    priority: '0.7',
    changefreq: 'monthly',
    article: g,
  })),
  {
    path: '/about/',
    title: `About ${site.name}: Private, Free Image Tools`,
    description: `Learn why ${site.name} exists, how our browser-based image compressor works and how we keep your files private.`,
    priority: '0.5',
    changefreq: 'yearly',
  },
  {
    path: '/contact/',
    title: `Contact Us | ${site.name}`,
    description: `Questions, feedback or bug reports? Get in touch with the ${site.name} team.`,
    priority: '0.4',
    changefreq: 'yearly',
  },
  {
    path: '/privacy-policy/',
    title: `Privacy Policy | ${site.name}`,
    description: `How ${site.name} handles your data, cookies and advertising. Your images are processed locally in your browser and are never uploaded.`,
    priority: '0.3',
    changefreq: 'yearly',
  },
  {
    path: '/terms/',
    title: `Terms of Service | ${site.name}`,
    description: `The terms and conditions for using ${site.name}.`,
    priority: '0.3',
    changefreq: 'yearly',
  },
]

export const normalize = (p) => (p === '/' ? '/' : p.replace(/\/?$/, '/'))
export const findRoute = (pathname) => routes.find((r) => r.path === normalize(pathname))
export const canonicalFor = (path) => `${site.url}${path}`
