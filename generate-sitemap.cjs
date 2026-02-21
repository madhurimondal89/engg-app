const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://www.calculatorfree.in';
const PUBLIC_DIR = path.join(__dirname, 'public');

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add main pages
function addUrl(loc, priority = '0.8', changefreq = 'weekly') {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${loc}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemap += `    <priority>${priority}</priority>\n`;
    sitemap += `  </url>\n`;
}

// Read all HTML files in public and public/calculators
function processDirectory(dir, routePrefix) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (file.endsWith('.html')) {
            // Ignore partials or specific files if needed
            let route = routePrefix + file;
            let priority = '0.8';

            if (route === '/index.html') {
                route = '/';
                priority = '1.0';
            } else if (file === 'google608401da6e5be338.html') {
                continue; // don't index verification files
            } else if (routePrefix.includes('/calculators/')) {
                priority = '0.9'; // Calculators have high priority
            }

            addUrl(`${DOMAIN}${route}`, priority);
        }
    }
}

processDirectory(PUBLIC_DIR, '/');
processDirectory(path.join(PUBLIC_DIR, 'calculators'), '/calculators/');

sitemap += `</urlset>`;

// Write to both public and client/public if it exists
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
console.log('Created public/sitemap.xml');

const CLIENT_PUBLIC_DIR = path.join(__dirname, 'client', 'public');
if (fs.existsSync(CLIENT_PUBLIC_DIR)) {
    fs.copyFileSync(path.join(PUBLIC_DIR, 'robots.txt'), path.join(CLIENT_PUBLIC_DIR, 'robots.txt'));
    fs.copyFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), path.join(CLIENT_PUBLIC_DIR, 'sitemap.xml'));
    console.log('Copied robots.txt and sitemap.xml to client/public');
}

console.log('Sitemap generation complete.');
