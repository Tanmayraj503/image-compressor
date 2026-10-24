// Original long-form articles. Plain data so both React and the build script can use it.
export const guides = [
  {
    slug: 'how-to-compress-images-without-losing-quality',
    title: 'How to Compress Images Without Losing Quality',
    description:
      'Learn how lossy and lossless compression work, which quality setting to choose, and a simple workflow to shrink photos by 60–80% with no visible difference.',
    date: '2026-10-01',
    readMinutes: 5,
    intro:
      'A single unoptimized photo from a modern phone can weigh 5 MB or more. Multiply that by a few images per page and you have a slow website, a full inbox, or an upload that keeps failing. The good news: most photos can be made dramatically smaller without anyone noticing a difference.',
    sections: [
      {
        h: 'Lossy vs. lossless compression',
        p: [
          'Lossless compression rewrites the file more efficiently but keeps every pixel exactly as it was. PNG is the best-known lossless format. Savings are real but modest, usually 10–30% for photos and more for flat graphics.',
          'Lossy compression, used by JPEG and WebP, throws away detail that the human eye is poor at noticing, such as tiny colour variations in busy areas. This is where the big savings come from: 60–90% smaller is common at settings most people cannot distinguish from the original.',
        ],
      },
      {
        h: 'Which quality setting should you choose?',
        p: ['Quality is not linear. The first few steps down from 100% shrink the file enormously while changing the image very little. After that, returns diminish and artifacts appear.'],
        list: [
          '90–100%: archival or print work. Files are large and the extra detail is rarely visible on screen.',
          '75–85%: the sweet spot for websites, blogs and social posts. Usually 3–5× smaller than the original with no visible change.',
          '60–70%: thumbnails, background images and email. Fine detail softens slightly, but it is still clean.',
          'Below 50%: visible blocky artifacts around edges and text. Only for previews where size matters more than looks.',
        ],
      },
      {
        h: 'Resize before you compress',
        p: [
          'Quality is only half the story. A 4000×3000 pixel photo displayed in a 800-pixel-wide column wastes more than 90% of its pixels. Resizing to the size you actually need often saves more than any quality slider, and the two stack: resize first, then compress.',
          'As a rule of thumb, export at the largest size the image will be displayed, or twice that for sharp results on high-density (retina) screens.',
        ],
      },
      {
        h: 'A simple workflow that works',
        p: ['Follow these steps for nearly any photo:'],
        list: [
          'Decide the maximum display width (for example 1200 px for a blog image).',
          'Resize the image to that width, keeping the aspect ratio.',
          'Export as WebP, or JPG if you need maximum compatibility, at about 80% quality.',
          'Compare the result to the original at 100% zoom. If you cannot see a difference, you are done; if you can, raise quality by 5–10 points.',
          'Keep your untouched originals. Compression is one-way, so never overwrite the master file.',
        ],
      },
      {
        h: 'Common mistakes to avoid',
        p: [
          'Re-compressing an already compressed JPEG again and again slowly degrades it, because each save discards a little more data. Always compress from the original when you can.',
          'Saving screenshots of text or interface elements as JPEG creates fuzzy halos around letters; PNG or lossless WebP is better for those. And remember that photos with transparency cannot be JPEG, since that format has no transparent pixels.',
        ],
      },
    ],
  },
  {
    slug: 'jpeg-vs-png-vs-webp',
    title: 'JPEG vs PNG vs WebP: Which Image Format Should You Use?',
    description:
      'A practical comparison of JPEG, PNG and WebP: file size, quality, transparency, browser support and exactly when to use each one.',
    date: '2026-10-05',
    readMinutes: 5,
    intro:
      'Choosing the right format can cut an image’s size in half before you touch a single setting. Here is how the three most common web formats compare, and how to decide between them in seconds.',
    sections: [
      {
        h: 'JPEG: the reliable choice for photos',
        p: [
          'JPEG (or JPG) has been the standard for photographs since the early 1990s. It uses lossy compression tuned for smooth gradients and natural scenes, so photos shrink beautifully. It is supported by literally every device, app and email client.',
          'Its weaknesses are sharp edges and text, which can pick up fuzzy artifacts, and the lack of transparency. Use it for photographs when you need universal compatibility.',
        ],
      },
      {
        h: 'PNG: lossless quality and transparency',
        p: [
          'PNG compresses without losing any data and supports full transparency. That makes it ideal for logos, icons, screenshots, diagrams and anything with crisp edges or flat colours.',
          'The trade-off is size. A photo saved as PNG is often five to ten times larger than the same photo as JPEG, so avoid PNG for photographs unless you truly need lossless quality or transparency.',
        ],
      },
      {
        h: 'WebP: the modern all-rounder',
        p: [
          'WebP, developed by Google, supports both lossy and lossless compression plus transparency and animation. In Google’s published comparisons, lossy WebP files are roughly 25–35% smaller than JPEG at similar visual quality, and lossless WebP files are about 25% smaller than PNG.',
          'Every current major browser supports WebP, so it is now a safe default for websites. The remaining gaps are older desktop software and some email clients and social upload forms that still insist on JPEG or PNG.',
        ],
      },
      {
        h: 'Quick comparison',
        table: {
          head: ['', 'JPEG', 'PNG', 'WebP'],
          rows: [
            ['Compression', 'Lossy', 'Lossless', 'Lossy or lossless'],
            ['Transparency', 'No', 'Yes', 'Yes'],
            ['Best for', 'Photos', 'Logos, screenshots', 'Almost anything on the web'],
            ['Photo file size', 'Small', 'Very large', 'Smallest'],
            ['Compatibility', 'Universal', 'Universal', 'All modern browsers'],
          ],
        },
      },
      {
        h: 'How to decide',
        p: ['Use this short checklist:'],
        list: [
          'Is it a website image? Use WebP, with JPEG as the fallback if you must support very old software.',
          'Does it need transparency? Use WebP or PNG.',
          'Is it a photo going into email, a document or a form that rejects WebP? Use JPEG.',
          'Is it a logo, icon or screenshot with text? Use PNG, or lossless WebP on the web.',
        ],
      },
    ],
  },
  {
    slug: 'best-image-sizes-for-websites-and-social-media',
    title: 'Best Image Sizes for Websites and Social Media',
    description:
      'Recommended image dimensions and file sizes for blog posts, hero banners, thumbnails, Open Graph previews, YouTube and Instagram, plus how to resize them correctly.',
    date: '2026-10-10',
    readMinutes: 4,
    intro:
      'Upload an image that is too large and your page loads slowly; upload one that is too small and it looks blurry. These recommended dimensions give you a good starting point for the most common places images appear.',
    sections: [
      {
        h: 'Website images',
        list: [
          'Full-width hero or banner: 1920 px wide, compressed to roughly 150–300 KB.',
          'Blog or article body image: 1200 px wide is plenty for most layouts, ideally under 150 KB.',
          'Product photos: 1000–1600 px on the longest side, so shoppers can zoom without waiting forever.',
          'Thumbnails and cards: 400–600 px wide, usually under 50 KB.',
          'Logos and icons: use SVG when possible; otherwise PNG or WebP at two times the display size.',
        ],
      },
      {
        h: 'Social media and sharing previews',
        p: ['Platforms change their layouts from time to time, so treat these as reliable starting points rather than strict rules and check each platform’s current guidance before a big campaign.'],
        list: [
          'Open Graph / link preview image (Facebook, LinkedIn, Slack, many chat apps): 1200×630 px.',
          'YouTube thumbnail: 1280×720 px (16:9), under 2 MB.',
          'Instagram feed post: 1080 px wide; square 1080×1080 or portrait 1080×1350.',
          'Profile pictures: upload a square image of at least 400×400 px; platforms crop it into a circle.',
        ],
      },
      {
        h: 'Why dimensions and file size are different things',
        p: [
          'Dimensions are measured in pixels (width × height). File size is measured in kilobytes or megabytes. Two images with identical dimensions can differ in size by a factor of ten depending on format and compression quality.',
          'That is why both matter. Resize to the dimensions you need, then compress to bring the file size down.',
        ],
      },
      {
        h: 'Do not forget high-density screens',
        p: [
          'Phones and many laptops have screens with two or three physical pixels for every CSS pixel. An image displayed 600 CSS pixels wide looks sharpest if the file is about 1200 pixels wide. Going beyond 2× rarely brings a visible benefit but adds a lot of weight.',
          'If your site supports responsive images, you can serve several widths and let the browser choose the best one for each visitor.',
        ],
      },
    ],
  },
  {
    slug: 'image-optimization-for-seo-and-page-speed',
    title: 'Image Optimization for SEO and Page Speed',
    description:
      'How image size affects Core Web Vitals, rankings and conversions, plus a practical checklist for file names, alt text, lazy loading and modern formats.',
    date: '2026-10-15',
    readMinutes: 5,
    intro:
      'Images are usually the heaviest part of a web page. Optimizing them is one of the highest-impact, lowest-effort ways to make a site faster, and speed affects both user experience and search visibility.',
    sections: [
      {
        h: 'Why images matter for speed',
        p: [
          'On a typical page, images account for the largest share of downloaded bytes. Heavy images slow the Largest Contentful Paint (LCP), one of Google’s Core Web Vitals. Google’s guidance treats an LCP of 2.5 seconds or less as good, and on many pages the LCP element is an image.',
          'Faster pages also tend to have lower bounce rates and better conversion, which is useful regardless of how search engines treat them.',
        ],
      },
      {
        h: 'A practical checklist',
        list: [
          'Resize images to the size they are displayed at (plus allowance for high-density screens).',
          'Compress them: roughly 75–85% quality for lossy formats.',
          'Use modern formats such as WebP where your audience’s browsers support them.',
          'Set explicit width and height attributes so the layout does not jump while images load (this helps Cumulative Layout Shift).',
          'Lazy-load images below the fold with loading="lazy", but never lazy-load your main above-the-fold image.',
          'Serve images from a fast host or CDN with long cache lifetimes.',
        ],
      },
      {
        h: 'Descriptive file names and alt text',
        p: [
          'Search engines cannot see an image the way people can; they rely on text around it. Use a short, descriptive file name such as red-running-shoes-side-view.webp rather than IMG_20260417_0231.jpg.',
          'Write alt text that describes what is in the image and its purpose, in plain language. It is essential for visitors who use screen readers, and it helps search engines understand the picture. Avoid stuffing keywords; a clear sentence is better than a list of terms.',
        ],
      },
      {
        h: 'Measure the result',
        p: [
          'After optimizing, test a few key pages with a tool such as PageSpeed Insights or the Lighthouse panel in Chrome. Look at the “Properly size images” and “Serve images in next-gen formats” audits, and watch your LCP. If you use Google Search Console, the Core Web Vitals report shows how real visitors experience your site over time.',
        ],
      },
    ],
  },
]

export const getGuide = (slug) => guides.find((g) => g.slug === slug)
