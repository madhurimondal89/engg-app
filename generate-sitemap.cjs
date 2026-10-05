const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://engineering.calculatorfree.in';
const PUBLIC_DIR = path.join(__dirname, 'public');
const CLIENT_PUBLIC_DIR = path.join(__dirname, 'client', 'public');
const TODAY = new Date().toISOString().split('T')[0];

const urlRegistry = new Map();

function registerUrl(urlPath, options = {}) {
  // Normalize path
  let cleanPath = urlPath.trim();
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  // Remove trailing slash unless root
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  const fullUrl = `${DOMAIN}${cleanPath === '/' ? '/' : cleanPath}`;
  if (!urlRegistry.has(fullUrl)) {
    urlRegistry.set(fullUrl, {
      loc: fullUrl,
      priority: options.priority || '0.85',
      changefreq: options.changefreq || 'weekly',
      lastmod: options.lastmod || TODAY,
      section: options.section || 'General',
      name: options.name || cleanPath
    });
  }
}

// ─── 1. CORE HUBS & PORTALS ───────────────────────────────────────────────
registerUrl('/', { priority: '1.0', changefreq: 'daily', section: 'Core Pages', name: 'Home Landing Page' });
registerUrl('/calculators', { priority: '0.95', changefreq: 'daily', section: 'Core Pages', name: 'Calculators Hub' });

// ─── 2. INTERACTIVE 2D SIMULATION STUDIOS ──────────────────────────────────
registerUrl('/calculators/beam-visualizer', { priority: '0.95', changefreq: 'weekly', section: 'Interactive 2D Studios', name: 'Beam SFD & BMD Visualizer' });
registerUrl('/calculators/mohrs-circle', { priority: '0.95', changefreq: 'weekly', section: 'Interactive 2D Studios', name: "Mohr's Circle 2D Tensor Studio" });
registerUrl('/calculators/phasor-visualizer', { priority: '0.95', changefreq: 'weekly', section: 'Interactive 2D Studios', name: '3-Phase AC Phasor & Waveforms Studio' });
registerUrl('/calculators/factor-calculator', { priority: '0.98', changefreq: 'daily', section: 'Interactive 2D Studios', name: 'Factor Calculator Studio' });

// ─── 3. DISCIPLINE HUBS ───────────────────────────────────────────────────
registerUrl('/calculators/electrical', { priority: '0.90', changefreq: 'weekly', section: 'Discipline Hubs', name: 'Electrical Engineering Hub' });
registerUrl('/calculators/mechanical', { priority: '0.90', changefreq: 'weekly', section: 'Discipline Hubs', name: 'Mechanical Engineering Hub' });
registerUrl('/calculators/civil', { priority: '0.90', changefreq: 'weekly', section: 'Discipline Hubs', name: 'Civil Engineering Hub' });
registerUrl('/calculators/fluid', { priority: '0.90', changefreq: 'weekly', section: 'Discipline Hubs', name: 'Fluid Mechanics Hub' });
registerUrl('/calculators/thermodynamics', { priority: '0.90', changefreq: 'weekly', section: 'Discipline Hubs', name: 'Thermodynamics & Heat Hub' });
registerUrl('/calculators/math', { priority: '0.95', changefreq: 'daily', section: 'Discipline Hubs', name: 'Mathematics 150+ Tools Hub' });

// ─── Helper to parse calculatorTypes from component files ──────────────────
function parseCalculatorTypes(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const m = content.match(/calculatorTypes\s*=\s*\[([\s\S]*?)\];/);
  if (!m) return [];
  const block = m[1];
  const items = [];
  const regex = /\{\s*id:\s*['"]([^'"]+)['"](?:,\s*name:\s*['"]([^'"]+)['"])?/g;
  let match;
  while ((match = regex.exec(block)) !== null) {
    items.push({ id: match[1], name: match[2] || match[1] });
  }
  return items;
}

// ─── 4. ELECTRICAL CALCULATORS (141 Tools) ──────────────────────────────────
const elecItems = parseCalculatorTypes('client/src/components/electrical-calculator.tsx');
for (const item of elecItems) {
  registerUrl(`/calculators/electrical/${item.id}`, {
    priority: '0.85',
    changefreq: 'weekly',
    section: 'Electrical Engineering Calculators',
    name: item.name
  });
}

// ─── 5. MECHANICAL CALCULATORS & SUB-DISCIPLINES ───────────────────────────
const mechMain = parseCalculatorTypes('client/src/components/mechanical-calculator.tsx');
for (const item of mechMain) {
  registerUrl(`/calculators/mechanical/${item.id}`, {
    priority: '0.85',
    changefreq: 'weekly',
    section: 'Mechanical Engineering Calculators',
    name: item.name
  });
}

// Sub-disciplines for Mechanical
const mechSubFiles = [
  { file: 'client/src/components/strength-calculator.tsx', sub: 'Strength of Materials' },
  { file: 'client/src/components/machine-design-calculator.tsx', sub: 'Machine Design' },
  { file: 'client/src/components/manufacturing-calculator.tsx', sub: 'Manufacturing Engineering' },
  { file: 'client/src/components/dynamics-calculator.tsx', sub: 'Engineering Dynamics' },
];

for (const sub of mechSubFiles) {
  const items = parseCalculatorTypes(sub.file);
  for (const item of items) {
    registerUrl(`/calculators/mechanical/${item.id}`, {
      priority: '0.85',
      changefreq: 'weekly',
      section: `Mechanical Engineering - ${sub.sub}`,
      name: item.name
    });
  }
}

// ─── 6. CIVIL ENGINEERING CALCULATORS ──────────────────────────────────────
const civilItems = parseCalculatorTypes('client/src/components/civil-calculator.tsx');
for (const item of civilItems) {
  registerUrl(`/calculators/civil/${item.id}`, {
    priority: '0.85',
    changefreq: 'weekly',
    section: 'Civil Engineering Calculators',
    name: item.name
  });
}

// ─── 7. FLUID MECHANICS CALCULATORS ────────────────────────────────────────
const fluidItems = parseCalculatorTypes('client/src/components/fluid-calculator.tsx');
for (const item of fluidItems) {
  registerUrl(`/calculators/fluid/${item.id}`, {
    priority: '0.85',
    changefreq: 'weekly',
    section: 'Fluid Mechanics Calculators',
    name: item.name
  });
}

// ─── 8. THERMODYNAMICS CALCULATORS ─────────────────────────────────────────
const thermoItems = parseCalculatorTypes('client/src/components/thermodynamics-calculator.tsx');
for (const item of thermoItems) {
  registerUrl(`/calculators/thermodynamics/${item.id}`, {
    priority: '0.85',
    changefreq: 'weekly',
    section: 'Thermodynamics & Heat Calculators',
    name: item.name
  });
}

// ─── 9. MATHEMATICS CALCULATORS ───────────────────────────────────────────
const mathDataFile = path.join(__dirname, 'client', 'src', 'lib', 'math-data.ts');
if (fs.existsSync(mathDataFile)) {
  const mathData = fs.readFileSync(mathDataFile, 'utf8');
  // Match id and name inside MATH_CALCULATORS (supporting both ' and " quotes)
  const mathRegex = /id:\s*['"]([^'"]+)['"],\s*\r?\n\s*name:\s*['"]([^'"]+)['"]/g;
  let mm;
  while ((mm = mathRegex.exec(mathData)) !== null) {
    const mId = mm[1];
    const mName = mm[2];
    const prio = (mId === 'factor-calculator' || mId === 'prime-factors' || mId === 'gcf-lcm') ? '0.95' : '0.85';
    registerUrl(`/calculators/math/${mId}`, {
      priority: prio,
      changefreq: 'weekly',
      section: 'Mathematics & Solvers',
      name: mName
    });
  }
}

// Special Math studios
registerUrl('/calculators/math/unit-solver', { priority: '0.90', changefreq: 'weekly', section: 'Mathematics & Solvers', name: 'Unit Solver Studio' });
registerUrl('/calculators/math/grapher', { priority: '0.90', changefreq: 'weekly', section: 'Mathematics & Solvers', name: '2D Function Grapher Studio' });

// ─── 10. STANDALONE STATIC HTML CALCULATORS ────────────────────────────────
const calculatorsHtmlDir = path.join(PUBLIC_DIR, 'calculators');
if (fs.existsSync(calculatorsHtmlDir)) {
  const htmlFiles = fs.readdirSync(calculatorsHtmlDir).filter(f => f.endsWith('.html'));
  for (const f of htmlFiles) {
    const slug = f.replace('.html', '');
    // Clean URL served via server route
    registerUrl(`/calculators/${slug}`, {
      priority: '0.80',
      changefreq: 'monthly',
      section: 'Standalone Interactive HTML Calculators',
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    });
  }
}

// ─── BUILD XML DOCUMENT ───────────────────────────────────────────────────
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

// Group by section for clean human-readable XML
const grouped = new Map();
for (const entry of urlRegistry.values()) {
  const sec = entry.section || 'General';
  if (!grouped.has(sec)) {
    grouped.set(sec, []);
  }
  grouped.get(sec).push(entry);
}

for (const [section, entries] of grouped.entries()) {
  xml += `\n  <!-- ─── ${section} (${entries.length} URLs) ────────────────────────── -->\n`;
  for (const item of entries) {
    xml += `  <url>\n`;
    xml += `    <loc>${item.loc}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  }
}

xml += `\n</urlset>\n`;

// ─── WRITE OUTPUT FILES ───────────────────────────────────────────────────
const publicSitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
fs.writeFileSync(publicSitemapPath, xml, 'utf8');
console.log(`Generated: ${publicSitemapPath} (${urlRegistry.size} total URLs)`);

if (fs.existsSync(CLIENT_PUBLIC_DIR)) {
  const clientSitemapPath = path.join(CLIENT_PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(clientSitemapPath, xml, 'utf8');
  console.log(`Synced: ${clientSitemapPath}`);
}

console.log('\n--- SITEMAP GENERATION SUMMARY ---');
for (const [section, entries] of grouped.entries()) {
  console.log(`  • ${section}: ${entries.length} URLs`);
}
console.log(`Total Indexed URLs: ${urlRegistry.size}`);
