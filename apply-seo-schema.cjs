const fs = require('fs');
const path = require('path');

const BRAND_URL = 'https://www.calculatorfree.in';
const BRAND_NAME = 'Engineering Calculator Hub';
const LOGO_URL = 'https://www.calculatorfree.in/favicon.png';

const indexFilePath = path.join(__dirname, 'public', 'index.html');
const calculatorsDir = path.join(__dirname, 'public', 'calculators');

// Upgrade Index.html Schema
if (fs.existsSync(indexFilePath)) {
    let content = fs.readFileSync(indexFilePath, 'utf8');
    const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;

    const advancedIndexSchema = `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "${BRAND_URL}/#organization",
          "name": "${BRAND_NAME}",
          "url": "${BRAND_URL}/",
          "logo": {
            "@type": "ImageObject",
            "url": "${LOGO_URL}"
          }
        },
        {
          "@type": "WebSite",
          "@id": "${BRAND_URL}/#website",
          "url": "${BRAND_URL}/",
          "name": "${BRAND_NAME}",
          "publisher": {
            "@id": "${BRAND_URL}/#organization"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "${BRAND_URL}/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "WebPage",
          "@id": "${BRAND_URL}/#webpage",
          "url": "${BRAND_URL}/",
          "inLanguage": "en-US",
          "name": "${BRAND_NAME} - Professional Calculators for Engineers",
          "description": "Comprehensive Engineering Calculator Hub with electrical, mechanical, and civil engineering calculators. Calculate Ohm's law, power, force, and more with step-by-step solutions.",
          "isPartOf": {
            "@id": "${BRAND_URL}/#website"
          },
          "about": {
            "@id": "${BRAND_URL}/#organization"
          }
        }
      ]
    }
    </script>`;

    if (re.test(content)) {
        content = content.replace(re, advancedIndexSchema);
        fs.writeFileSync(indexFilePath, content, 'utf8');
        console.log('Upgraded public/index.html schema');
    }
}

// Upgrade Calculators Schema
const files = fs.readdirSync(calculatorsDir);
for (const file of files) {
    if (!file.endsWith('.html')) continue;

    const fullPath = path.join(calculatorsDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
    const match = content.match(re);

    if (match && match[1]) {
        try {
            const oldSchema = JSON.parse(match[1].trim());
            const appName = oldSchema.name || file.replace('.html', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            const appDesc = oldSchema.description || `Professional ${appName} for engineers and students.`;
            const appFeatures = Array.isArray(oldSchema.featureList) ? oldSchema.featureList : [];
            const absoluteUrl = `${BRAND_URL}/calculators/${file}`;

            // Determine discipline based on existing Breadcrumbs div if possible, default to generic "Calculators"
            let disciplineName = "Engineering Calculators";
            if (content.includes('Electrical Engineering')) disciplineName = "Electrical Engineering";
            if (content.includes('Mechanical Engineering')) disciplineName = "Mechanical Engineering";
            if (content.includes('Civil Engineering')) disciplineName = "Civil Engineering";

            const advancedCalcSchema = {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "SoftwareApplication",
                        "@id": `${absoluteUrl}/#software`,
                        "name": appName,
                        "description": appDesc,
                        "applicationCategory": "EducationalApplication",
                        "operatingSystem": "Any",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "@id": `${BRAND_URL}/#organization`,
                            "name": BRAND_NAME,
                            "url": BRAND_URL,
                            "logo": {
                                "@type": "ImageObject",
                                "url": LOGO_URL
                            }
                        },
                        "featureList": appFeatures
                    },
                    {
                        "@type": "BreadcrumbList",
                        "@id": `${absoluteUrl}/#breadcrumb`,
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": BRAND_URL
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": disciplineName,
                                "item": `${BRAND_URL}/`
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": appName,
                                "item": absoluteUrl
                            }
                        ]
                    },
                    {
                        "@type": "WebPage",
                        "@id": `${absoluteUrl}/#webpage`,
                        "url": absoluteUrl,
                        "name": `${appName} - ${BRAND_NAME}`,
                        "description": appDesc,
                        "isPartOf": {
                            "@id": `${BRAND_URL}/#website`
                        },
                        "mainEntity": {
                            "@id": `${absoluteUrl}/#software`
                        }
                    }
                ]
            };

            const replacementTag = `<script type="application/ld+json">\n    ${JSON.stringify(advancedCalcSchema, null, 4)}\n    </script>`;
            content = content.replace(re, replacementTag);
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Upgraded schema in ${file}`);

        } catch (e) {
            console.error(`Failed to parse old schema in ${file}:`, e.message);
        }
    }
}
console.log('Advanced SEO Schema rollout complete.');
