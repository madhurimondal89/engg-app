const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Pattern 1: With 'active' class on Home
            const target1 = `<a href="/" class="nav-link active">Home</a>\n                    <a href="/about.html" class="nav-link">About</a>`;
            const replacement1 = `<a href="https://www.calculatorfree.in/" class="nav-link active">Home</a>\n                    <a href="https://health-hub.calculatorfree.in" class="nav-link">HealthHub</a>\n                    <a href="https://financialhub.calculatorfree.in/" class="nav-link">FinancialHub</a>`;

            if (content.includes(target1)) {
                content = content.replace(target1, replacement1);
                modified = true;
            }

            // Pattern 2: Without 'active' class on Home
            const target2 = `<a href="/" class="nav-link">Home</a>\n                    <a href="/about.html" class="nav-link">About</a>`;
            const replacement2 = `<a href="https://www.calculatorfree.in/" class="nav-link">Home</a>\n                    <a href="https://health-hub.calculatorfree.in" class="nav-link">HealthHub</a>\n                    <a href="https://financialhub.calculatorfree.in/" class="nav-link">FinancialHub</a>`;

            if (content.includes(target2)) {
                content = content.replace(target2, replacement2);
                modified = true;
            }

            // Pattern 3: CRLF variants (just in case)
            const target3 = `<a href="/" class="nav-link active">Home</a>\r\n                    <a href="/about.html" class="nav-link">About</a>`;
            const replacement3 = `<a href="https://www.calculatorfree.in/" class="nav-link active">Home</a>\r\n                    <a href="https://health-hub.calculatorfree.in" class="nav-link">HealthHub</a>\r\n                    <a href="https://financialhub.calculatorfree.in/" class="nav-link">FinancialHub</a>`;

            if (content.includes(target3)) {
                content = content.replace(target3, replacement3);
                modified = true;
            }

            const target4 = `<a href="/" class="nav-link">Home</a>\r\n                    <a href="/about.html" class="nav-link">About</a>`;
            const replacement4 = `<a href="https://www.calculatorfree.in/" class="nav-link">Home</a>\r\n                    <a href="https://health-hub.calculatorfree.in" class="nav-link">HealthHub</a>\r\n                    <a href="https://financialhub.calculatorfree.in/" class="nav-link">FinancialHub</a>`;

            if (content.includes(target4)) {
                content = content.replace(target4, replacement4);
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInDir(path.join(__dirname, 'public'));
