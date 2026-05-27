/**
 * fix-seo-all.cjs
 * Fixes SEO issues in all 24 calculator HTML pages:
 * 1. Canonical URL
 * 2. OG URL (replit.app → calculatorfree.in)
 * 3. AdSense script
 * 4. lastmod in sitemap
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'public', 'calculators');
const DOMAIN = 'https://engineering.calculatorfree.in';
const ADSENSE = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8732458645979427" crossorigin="anonymous"></script>`;

const files = fs.readdirSync(BASE).filter(f => f.endsWith('.html'));

let changed = 0;
let skipped = 0;

files.forEach(filename => {
  const filepath = path.join(BASE, filename);
  let html = fs.readFileSync(filepath, 'utf8');
  let original = html;
  const pageUrl = `${DOMAIN}/calculators/${filename}`;

  // 1. Fix OG URL (replit.app → calculatorfree.in)
  html = html.replace(
    /(<meta property="og:url" content=")[^"]*(")/g,
    `$1${pageUrl}$2`
  );

  // 2. Add/fix canonical tag
  if (html.includes('<link rel="canonical"')) {
    // Update existing canonical
    html = html.replace(
      /(<link rel="canonical" href=")[^"]*(")/g,
      `$1${pageUrl}$2`
    );
  } else {
    // Add canonical after viewport meta
    html = html.replace(
      /(<meta name="viewport"[^>]*>)/,
      `$1\n    <link rel="canonical" href="${pageUrl}" />`
    );
  }

  // 3. Add AdSense if not present
  if (!html.includes('adsbygoogle.js')) {
    // Add before </head>
    html = html.replace('</head>', `    ${ADSENSE}\n</head>`);
  }

  // 4. Fix Schema.org URLs inside JSON-LD (replit.app references)
  html = html.replace(/engineering-calculators\.replit\.app/g, 'engineering.calculatorfree.in');

  if (html !== original) {
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`✅ Fixed: ${filename}`);
    changed++;
  } else {
    console.log(`⏭️  No change: ${filename}`);
    skipped++;
  }
});

console.log(`\n📊 Summary: ${changed} fixed, ${skipped} unchanged`);

// --- Update sitemap.xml ---
console.log('\n📝 Updating sitemap.xml...');
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

// Update all lastmod dates to today
sitemap = sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, '<lastmod>2026-05-27</lastmod>');

// Add /app pages if not already present
const appPages = [
  { url: `${DOMAIN}/app?discipline=electrical`, priority: '0.8' },
  { url: `${DOMAIN}/app?discipline=mechanical`, priority: '0.8' },
  { url: `${DOMAIN}/app?discipline=civil`, priority: '0.8' },
];

appPages.forEach(({ url, priority }) => {
  if (!sitemap.includes(url)) {
    const entry = `  <url>\n    <loc>${url}</loc>\n    <lastmod>2026-05-27</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    sitemap = sitemap.replace('</urlset>', `${entry}\n</urlset>`);
    console.log(`  Added: ${url}`);
  }
});

fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('✅ Sitemap updated');

// --- Update robots.txt ---
console.log('\n📝 Updating robots.txt...');
const robotsPath = path.join(__dirname, 'public', 'robots.txt');
const newRobots = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://engineering.calculatorfree.in/sitemap.xml
`;
fs.writeFileSync(robotsPath, newRobots, 'utf8');
console.log('✅ robots.txt updated');

console.log('\n🎉 All SEO fixes applied!');
