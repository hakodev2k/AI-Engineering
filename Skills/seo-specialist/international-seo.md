# International SEO

## Purpose
Design search architecture for multiple countries and languages while minimizing duplication and incorrect regional targeting.

## When to use
Use for international expansion, localization, hreflang defects, or country/language site consolidation.

## Inputs
Markets, languages, localized URLs, content equivalence, domains, canonicals, hreflang, and business availability.

## Context to inspect
URL strategy, translation quality, local inventory, currency, legal differences, internal links, redirects, sitemaps, and geolocation behavior.

## Core knowledge
Language and country are different dimensions. Hreflang is an annotation between valid indexable alternatives, not a substitute for localization or canonicalization.

## Procedure
1. Define supported language-country combinations.
2. Choose maintainable URL architecture.
3. Map equivalent localized pages.
4. Ensure each variant is independently indexable and useful.
5. Implement reciprocal hreflang annotations including self references where appropriate.
6. Align canonicals to each localized page.
7. Avoid forced IP redirects that block access.
8. Validate annotations and monitor regional search performance.

## Decision points
Use ccTLDs, subdomains, or subdirectories based on governance, cost, branding, and platform constraints; no option is universally superior.

## Common failure patterns
Canonicalizing translations to one language, invalid hreflang codes, incomplete return links, machine translation without quality review, and automatic redirects.

## Verification
Crawl annotations, test localized pages, validate reciprocal mappings, and inspect regional query/indexation data.

## Expected output
International architecture, hreflang map, localization requirements, and monitoring plan.

## Stop conditions
Escalate when market ownership or legal localization requirements are unclear.