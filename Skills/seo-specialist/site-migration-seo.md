# Site Migration SEO

## Purpose
Preserve discoverability, relevance signals, and user access during domain, platform, URL, protocol, or architecture migrations.

## When to use
Use before any migration that changes URLs, rendering, templates, domains, or information architecture.

## Inputs
Old/new URL inventories, analytics, backlinks, rankings, templates, redirect capabilities, sitemaps, and release plan.

## Context to inspect
High-value URLs, redirects, canonicals, robots, metadata, internal links, status codes, structured data, and tracking.

## Core knowledge
Migration risk grows with simultaneous changes. URL mapping and post-launch monitoring are operational controls, not paperwork.

## Procedure
1. Baseline traffic, rankings, indexation, and top URLs.
2. Inventory old URLs and map each to the closest valid destination.
3. Avoid unnecessary URL changes.
4. Validate new templates in staging without exposing them publicly.
5. Prepare direct server-side redirects.
6. Update canonicals, links, sitemaps, hreflang, and tracking.
7. Crawl pre-launch and execute a launch checklist.
8. Crawl production immediately after release.
9. Monitor errors, indexation, traffic, and rankings until stable.

## Decision points
Map to equivalent content; use 404/410 when no meaningful replacement exists rather than redirecting everything to the homepage.

## Common failure patterns
Redirect chains, staging noindex leaking to production, missing legacy URLs, and changing content plus architecture without necessity.

## Verification
Compare old/new URL coverage, redirects, crawl signals, analytics, and search performance.

## Expected output
Migration map, launch controls, rollback criteria, and monitoring dashboard.

## Stop conditions
Block launch when critical redirect, indexability, or tracking defects remain.