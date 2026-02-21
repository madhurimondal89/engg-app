const fs = require('fs');
const path = require('path');

const OLD_FOOTER = `<p>&copy; 2024 Engineering Calculator Hub. All rights reserved.</p>`;
const OLD_FOOTER_ALT = `<p>&copy; 2024 Engineering Calculator Suite. All rights reserved.</p>`;

const NEW_FOOTER = `<p>&copy; 2026 calculatorfree.in All Rights Reserved.</p>
                <p class="footer-links" style="margin-top: 10px; font-size: 0.9em;">
                    <a href="/about.html">About Us</a> | 
                    <a href="/contact.html">Contact Us</a> | 
                    <a href="/privacy-policy.html">Privacy Policy</a> | 
                    <a href="/disclaimer.html">Disclaimer</a> | 
                    <a href="/terms.html">Terms & Conditions</a> | 
                    <a href="/dmca.html">DMCA</a>
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
            let modified = false;

            if (content.includes(OLD_FOOTER)) {
                content = content.split(OLD_FOOTER).join(NEW_FOOTER);
                modified = true;
            } else if (content.includes(OLD_FOOTER_ALT)) {
                content = content.split(OLD_FOOTER_ALT).join(NEW_FOOTER);
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated footer in ${fullPath}`);
            }
        }
    }
}

replaceInDir(__dirname);
console.log('Footer update complete.');
