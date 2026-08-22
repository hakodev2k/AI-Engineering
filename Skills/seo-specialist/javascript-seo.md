# JavaScript SEO

## Purpose
Ensure client-rendered applications expose crawlable, indexable, stable content and links to search engines.

## When to use
Use for SPAs, SSR/SSG applications, hydration changes, rendering failures, or content missing from indexed output.

## Inputs
Application routes, source/rendered HTML, network traces, framework behavior, crawler tests, and deployment configuration.

## Context to inspect
Initial HTML, hydration, lazy loading, routing, links, metadata, status codes, robots, canonicals, structured data, and error states.

## Core knowledge
Rendering strategy affects discovery, latency, reliability, and metadata. Search compatibility should be verified from delivered and rendered output, not framework assumptions.

## Procedure
1. Identify critical routes and content.
2. Compare raw response with browser-rendered DOM.
3. Test links and metadata without user interaction.
4. Inspect route status handling and soft 404s.
5. Check lazy-loaded content and resources.
6. Evaluate SSR, SSG, dynamic rendering, or CSR trade-offs.
7. Fix systemic template issues.
8. Test production builds with representative crawlers.

## Decision points
Prefer SSR/SSG when critical content benefits from deterministic HTML; CSR can remain appropriate when search discovery is irrelevant or rendering is proven reliable.

## Common failure patterns
Hash-only routing, button-based navigation, client-only metadata, blocked assets, and returning 200 for missing routes.

## Verification
Inspect HTTP responses, rendered DOM, crawl results, and search-engine rendering diagnostics.

## Expected output
Rendering findings, recommended architecture changes, tests, and production verification.

## Stop conditions
Escalate when framework changes require architectural approval.