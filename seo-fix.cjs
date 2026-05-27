
// SEO Fix Script - Node.js version
// Updates all calculator HTML files: OG URLs, canonical tags, AdSense
const fs = require('fs');
const path = require('path');

const calcDir = path.join(__dirname, 'public', 'calculators');
const ADSENSE = `    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8732458645979427" crossorigin="anonymous"></script>`;

const files = fs.readdirSync(calcDir).filter(f => f.endsWith('.html'));

let processed = 0;
for (const filename of files) {
    const filePath = path.join(calcDir, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Fix og:url - replace wrong domain
    content = content.replace(
        /https:\/\/engineering-calculators\.replit\.app\/calculators\//g,
        'https://engineering.calculatorfree.in/calculators/'
    );
    
    // 2. Add canonical tag after viewport meta (if not already present)
    const canonicalUrl = `https://engineering.calculatorfree.in/calculators/${filename}`;
    const canonicalTag = `    <link rel="canonical" href="${canonicalUrl}" />`;
    
    if (!content.includes('rel="canonical"')) {
        content = content.replace(
            /(<meta name="viewport"[^>]*>)/,
            `$1\r\n${canonicalTag}`
        );
    }
    
    // 3. Add AdSense script if not already present
    if (!content.includes('pagead2.googlesyndication.com')) {
        content = content.replace('</head>', `${ADSENSE}\r\n</head>`);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Processed: ${filename}`);
    processed++;
}

console.log(`\n✅ Done! Processed ${processed}/${files.length} files.`);
