import { Link } from 'react-router-dom'
import site from '../site.config.js'

function Page({ title, children, updated }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
      {updated && <p className="mt-2 text-sm text-slate-500">Last updated: {site.lastUpdated}</p>}
      <div className="prose prose-slate mt-8 max-w-none prose-a:text-teal-700">{children}</div>
    </div>
  )
}

export function About() {
  return (
    <Page title={`About ${site.name}`}>
      <p>
        {site.name} is a free image compressor and resizer built for people who just want a smaller image, fast, without handing their photos to a stranger’s server.
      </p>
      <h2>Why we built it</h2>
      <p>
        Many online “image optimizers” upload your files to a remote server, make you wait in a queue, add watermarks or cap how much you can do per day. We thought there was a better way: modern browsers are powerful enough to compress and resize images on your own device in a fraction of a second.
      </p>
      <h2>How it works</h2>
      <p>
        When you add an image, your browser decodes it, redraws it at the size you choose and re-encodes it as JPG, PNG or WebP at the quality you pick. All of this uses technology built into your browser. Your images are never transmitted to us, which makes the tool fast and private by design. You can read more about how to choose settings in our <Link to="/guides/">image optimization guides</Link>.
      </p>
      <h2>What we stand for</h2>
      <ul>
        <li><strong>Privacy first:</strong> no uploads, no accounts, no tracking of your files.</li>
        <li><strong>Honest tools:</strong> no watermarks, no hidden limits, no dark patterns.</li>
        <li><strong>Useful education:</strong> our guides explain the “why” so you can make good decisions on your own.</li>
      </ul>
      <h2>How we pay the bills</h2>
      <p>
        {site.name} is free to use and supported by advertising. Ads are clearly labeled and never block the tool. See our <Link to="/privacy-policy/">Privacy Policy</Link> for details about cookies and advertising.
      </p>
      <h2>Get in touch</h2>
      <p>
        Found a bug or have an idea? Visit our <Link to="/contact/">contact page</Link>. We read every message.
      </p>
    </Page>
  )
}

export function Contact() {
  return (
    <Page title="Contact us">
      <p>
        We would love to hear from you, whether it is a bug report, a feature request, a question about the tool or feedback about our guides.
      </p>
      <h2>Email</h2>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <p>We aim to reply within two to three business days.</p>
      <h2>Before you write</h2>
      <ul>
        <li>For help choosing settings, see our <Link to="/guides/">guides</Link> and the FAQ on the <Link to="/">home page</Link>.</li>
        <li>If an image fails to process, tell us your browser, its version and the image format. We never see your images, so a description helps us reproduce the problem.</li>
        <li>For privacy questions, please read our <Link to="/privacy-policy/">Privacy Policy</Link> first.</li>
      </ul>
    </Page>
  )
}

export function Privacy() {
  return (
    <Page title="Privacy Policy" updated>
      <p>
        This Privacy Policy explains what information {site.name} (“we”, “us”) handles when you use {site.url.replace(/^https?:\/\//, '')} (the “Site”). We keep it short because we collect very little.
      </p>
      <h2>Your images stay on your device</h2>
      <p>
        The image compression and resizing tool runs entirely in your web browser. The images you add are processed locally on your device and are <strong>not uploaded to, stored on or viewed by</strong> our servers or any third party.
      </p>
      <h2>Information we collect</h2>
      <p>
        We do not require an account and we do not ask you for personal information to use the tool. Like most websites, our hosting provider may automatically record standard technical data in server logs, such as IP address, browser type, referring page and the time of the request, for security and to keep the Site running.
      </p>
      <h2>Cookies and advertising</h2>
      <p>
        We use Google AdSense, a service provided by Google, to display advertisements. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this Site or other websites.
      </p>
      <ul>
        <li>Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this Site and/or other sites on the Internet.</li>
        <li>You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">Google Ads Settings</a>. You can also opt out of some third-party vendors’ use of cookies for personalized advertising at <a href="https://www.aboutads.info" rel="noopener noreferrer" target="_blank">www.aboutads.info</a>.</li>
        <li>You can learn how Google uses data from sites that use its services at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank">policies.google.com/technologies/partner-sites</a>.</li>
        <li>Visitors in the European Economic Area, the United Kingdom and Switzerland are shown a consent message so they can choose how cookies and similar technologies are used for advertising.</li>
      </ul>
      <p>
        You can also control or delete cookies through your browser settings. Blocking cookies may affect how ads are shown but does not affect the compression tool.
      </p>
      <h2>Analytics</h2>
      <p>
        We may use privacy-conscious analytics, such as Google Search Console and aggregated traffic statistics, to understand which pages are useful and to fix problems. These tools never receive the content of your images.
      </p>
      <h2>Local storage</h2>
      <p>
        The Site does not need to store your files or settings. Any data kept in your browser’s memory while you use the tool is cleared when you close or refresh the page.
      </p>
      <h2>Your rights (GDPR / CCPA)</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, delete or restrict the use of personal data we hold about you, to object to its processing, and, in California, to opt out of the “sale” or “sharing” of personal information. Because we collect so little, there is usually nothing to delete, but you may contact us at any time to make a request.
      </p>
      <h2>Children’s privacy</h2>
      <p>
        The Site is not directed at children under 13, and we do not knowingly collect personal information from children.
      </p>
      <h2>External links</h2>
      <p>
        The Site may link to other websites. We are not responsible for the privacy practices of third-party sites, and we encourage you to read their policies.
      </p>
      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top shows when it was last revised.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Email <a href={`mailto:${site.email}`}>{site.email}</a> or visit our <Link to="/contact/">contact page</Link>.
      </p>
    </Page>
  )
}

export function Terms() {
  return (
    <Page title="Terms of Service" updated>
      <p>
        By accessing or using {site.name} (the “Site”), you agree to these Terms. If you do not agree, please do not use the Site.
      </p>
      <h2>Use of the service</h2>
      <p>
        The Site provides a free, browser-based tool for compressing and resizing images. You may use it for personal or commercial purposes, provided you comply with the law and do not misuse the Site, for example by attempting to disrupt it, scrape it at an abusive rate or reverse engineer its security.
      </p>
      <h2>Your content</h2>
      <p>
        You keep all rights to the images you process. Because processing happens in your browser, we do not receive, store or have any license to your images. You are responsible for making sure you have the right to modify and use the images you process.
      </p>
      <h2>No warranty</h2>
      <p>
        The Site is provided “as is” and “as available” without warranties of any kind. Compression is lossy by nature and results may vary by image and browser. Always keep a copy of your original files; we are not responsible for any loss of data or quality.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {site.name} will not be liable for any indirect, incidental or consequential damages arising from your use of, or inability to use, the Site.
      </p>
      <h2>Advertising and third-party links</h2>
      <p>
        The Site displays third-party advertisements and may link to external websites. We do not control and are not responsible for their content or practices. See our <Link to="/privacy-policy/">Privacy Policy</Link> for more on advertising.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The Site’s design, text, guides and code are owned by {site.owner} and protected by applicable copyright laws. You may link to our pages but may not copy our content for republication without permission.
      </p>
      <h2>Changes</h2>
      <p>
        We may modify these Terms at any time. Continued use of the Site after changes means you accept the updated Terms.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </Page>
  )
}
