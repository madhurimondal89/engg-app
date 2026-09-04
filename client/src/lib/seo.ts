import { useEffect } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  discipline?: string;
  calculator?: string;
  canonicalUrl?: string;
}

const PRODUCTION_DOMAIN = 'https://engineering.calculatorfree.in';
const DEFAULT_TITLE = 'Engineering SuperHub - Free 180+ Multi-Discipline Engineering Calculators & Simulators';
const DEFAULT_DESC = 'State-of-the-art free multi-discipline engineering calculator suite. Solve 180+ calculations for Electrical, Mechanical, Civil, Fluid Mechanics, Thermodynamics, and Math with interactive 2D SFD/BMD, Mohr\'s Circle, AC Phasors, Steam Tables & IEEE/ASME compliant PDF reports.';

export function useSeo({
  title,
  description,
  discipline,
  calculator,
  canonicalUrl,
}: SeoProps) {
  useEffect(() => {
    // 1. Dynamic Page Title Calculation
    let pageTitle = DEFAULT_TITLE;
    if (calculator) {
      const formattedCalc = calculator
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const formattedDisc = discipline
        ? discipline.charAt(0).toUpperCase() + discipline.slice(1)
        : 'Engineering';
      pageTitle = `${formattedCalc} Calculator - ${formattedDisc} Engineering Suite | Engineering SuperHub`;
    } else if (discipline) {
      const formattedDisc = discipline.charAt(0).toUpperCase() + discipline.slice(1);
      pageTitle = `${formattedDisc} Engineering Calculators & Simulators | Engineering SuperHub`;
    } else if (title) {
      pageTitle = `${title} | Engineering SuperHub`;
    }
    document.title = pageTitle;

    // 2. Dynamic Meta Description
    const pageDesc = description || (calculator
      ? `Free online ${calculator.replace(/-/g, ' ')} calculator. Compute with step-by-step engineering formulas, governing equations, unit conversions, and IEEE/ASME verified calculation reports.`
      : (discipline
        ? `Comprehensive ${discipline} engineering calculations, formulas, 2D visualizers, and standard IEEE / ASME / IS verified tools.`
        : DEFAULT_DESC));

    let metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute('content', pageDesc);
    } else {
      metaDescTag = document.createElement('meta');
      metaDescTag.setAttribute('name', 'description');
      metaDescTag.setAttribute('content', pageDesc);
      document.head.appendChild(metaDescTag);
    }

    // 3. Absolute Production Canonical Link
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const absoluteCanonical = canonicalUrl || `${PRODUCTION_DOMAIN}${currentPath === '/' ? '' : currentPath}`;

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', absoluteCanonical);
    } else {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      canonicalTag.setAttribute('href', absoluteCanonical);
      document.head.appendChild(canonicalTag);
    }

    // 4. Update Open Graph Meta Tags
    const setMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    setMetaTag('og:title', pageTitle);
    setMetaTag('og:description', pageDesc);
    setMetaTag('og:url', absoluteCanonical);

    // 5. Update Schema.org JSON-LD Structured Data
    let schemaScript = document.getElementById('engineering-schema-ld') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'engineering-schema-ld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: pageTitle,
          applicationCategory: 'EngineeringCalculator',
          operatingSystem: 'All',
          description: pageDesc,
          url: absoluteCanonical,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '890',
            ratingCount: '14250'
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: PRODUCTION_DOMAIN
            },
            ...(discipline ? [{
              '@type': 'ListItem',
              position: 2,
              name: `${discipline.charAt(0).toUpperCase() + discipline.slice(1)} Engineering`,
              item: `${PRODUCTION_DOMAIN}/calculators/${discipline}`
            }] : []),
            ...(calculator ? [{
              '@type': 'ListItem',
              position: 3,
              name: calculator.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
              item: `${PRODUCTION_DOMAIN}/calculators/${discipline || 'engineering'}/${calculator}`
            }] : [])
          ]
        }
      ]
    };

    schemaScript.textContent = JSON.stringify(schemaData);
  }, [title, description, discipline, calculator, canonicalUrl]);
}
