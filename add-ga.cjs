const fs = require('fs');
const path = require('path');

const GA_ID = 'G-J0Q2TDZH63';
const GA_SCRIPT = [
  '  <!-- Google Analytics -->',
  '  <script async src="https://www.googletagmanager.com/gtag/js?id=' + GA_ID + '"></script>',
  '  <script>',
  '    window.dataLayer = window.dataLayer || [];',
  '    function gtag(){dataLayer.push(arguments);}',
  '    gtag("js", new Date());',
  '    gtag("config", "' + GA_ID + '");',
  '  </script>'
].join('\n');

// Fix all calculator HTML files
const calcDir = path.join('public', 'calculators');
const files = fs.readdirSync(calcDir).filter(function(f) { return f.endsWith('.html'); });
let fixed = 0;

files.forEach(function(file) {
  const fp = path.join(calcDir, file);
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes(GA_ID)) {
    html = html.replace('</head>', GA_SCRIPT + '\n</head>');
    fs.writeFileSync(fp, html, 'utf8');
    fixed++;
    console.log('GA added: ' + file);
  } else {
    console.log('Already has GA: ' + file);
  }
});

// Fix public/index.html
const indexPath = path.join('public', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
if (!indexHtml.includes(GA_ID)) {
  indexHtml = indexHtml.replace('</head>', GA_SCRIPT + '\n</head>');
  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log('GA added: public/index.html');
} else {
  console.log('Already has GA: public/index.html');
}

console.log('\nDone! Fixed ' + fixed + ' calculator files.');
