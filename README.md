# PixelSqueeze - Image Compressor & Resizer (React + Tailwind)

Client-side image compressor/resizer: drag & drop, paste (Ctrl+V), batch, ZIP download, JPG/PNG/WebP, resize by px/%, target file size.

## Run
```
npm install
npm run dev      # development
npm run build    # production build → dist/ (also generates icons, per-page HTML, sitemap, robots)
```
Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3…). Each page has its own HTML file, so no rewrite rules are required.

## Before going live: edit `src/site.config.js`
1. `url` – your real domain (used for canonicals, sitemap, robots.txt, social cards).
2. `email` – a working mailbox on your domain (shown on Contact / Privacy / Terms).
3. `name`, `owner` – your brand. Replace `public/favicon.svg` to change the icon, then `npm run build` regenerates every size + favicon.ico.
4. `searchConsoleToken` – Search Console → "HTML tag" method → paste the `content` value.
5. `adsense.client` (`ca-pub-…`) – once set, the build injects the AdSense script, the `google-adsense-account` meta tag, and writes `ads.txt`. `adsense.slots` are optional ad-unit IDs; leave empty to use Auto ads.

## Google Search Console
Add the property, verify with the token above, then submit `https://yourdomain/sitemap.xml`.

## Google AdSense checklist


- Never click your own ads or ask others to.
