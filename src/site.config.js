// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE before you deploy. Everything SEO / AdSense
//  related is driven from here (see README.md).
// ─────────────────────────────────────────────────────────────
export default {
  name: 'PixelSqueeze',
  tagline: 'Free Image Compressor & Resizer',
  // Your final public URL, NO trailing slash. Used for canonical URLs, sitemap, robots.txt.
  url: 'https://www.example.com',
  // A real mailbox on your own domain. AdSense reviewers look for a working contact method.
  email: 'contact@example.com',
  owner: 'PixelSqueeze',
  lastUpdated: 'October 24, 2026',

  // Google Search Console "HTML tag" verification: paste ONLY the content="..." value.
  searchConsoleToken: '',

  adsense: {
    // Your publisher ID, e.g. 'ca-pub-1234567890123456'. Leave empty until approved/ready.
    client: '',
    // Optional ad unit IDs (create "Display ads" units in AdSense). Empty = rely on Auto ads.
    slots: { inContent: '', footer: '' },
  },
}
