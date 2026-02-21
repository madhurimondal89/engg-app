const fs = require('fs');
const path = require('path');

const NEW_LINKS = `<p class="footer-links" style="margin-top: 10px; font-size: 0.9em;">
                    <a href="https://www.calculatorfree.in/about-us/">About Us</a> | 
                    <a href="https://www.calculatorfree.in/contact-us/">Contact Us</a> | 
                    <a href="https://www.calculatorfree.in/privacy-policy/">Privacy Policy</a> | 
                    <a href="https://www.calculatorfree.in/disclaimer/">Disclaimer</a> | 
                    <a href="https://www.calculatorfree.in/terms-conditions/">Terms & Conditions</a> | 
                    <a href="https://www.calculatorfree.in/dmca-policy/">DMCA</a>
                </p>`;

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file.startsWith('.')) continue;

        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            const re = /<p class="footer-links"[^>]*>[\s\S]*?<\/p>/;
            if (re.test(content)) {
                content = content.replace(re, NEW_LINKS);
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated footer links in ${fullPath}`);
            }
        }
    }
}

replaceInDir(__dirname);
console.log('Footer links update complete.');
