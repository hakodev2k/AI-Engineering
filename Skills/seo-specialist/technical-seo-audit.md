# Technical SEO Audit

## Purpose
Diagnose crawl, indexation, rendering, canonicalization, and site-quality issues that prevent organic visibility.

## When to use
Use for new sites, migrations, traffic drops, recurring health reviews, or unexplained indexation gaps.

## Inputs
Site URL, crawl data, search-console evidence, templates, robots directives, sitemaps, logs, and release history.

## Context to inspect
Architecture, URL patterns, status codes, canonicals, robots rules, redirects, pagination, JavaScript rendering, structured data, and internal links.

## Core knowledge
Search engines discover, render, canonicalize, index, and rank URLs through separate stages. Fix evidence-backed blockers before cosmetic warnings.

## Procedure
1. Establish affected scope and baseline.
2. Crawl representative and high-value URLs.
3. Compare crawlable, indexable, canonical, and indexed states.
4. Inspect directives, status codes, redirects, rendering, sitemaps, and internal links.
5. Group issues by root cause and template.
6. Prioritize by business impact, scale, confidence, and effort.
7. Define implementation requirements and regression checks.
8. Re-crawl and validate after release.

## Decision points
Prefer template-level fixes for systemic defects; avoid changing valid behavior merely to satisfy crawler warnings.

## Common failure patterns
Treating every warning equally, auditing only the homepage, ignoring rendered HTML, changing canonicals without evidence, and declaring success before recrawl.

## Verification
Confirm fixes in production with crawls, server responses, rendered output, and search-engine diagnostics where available.

## Expected output
Prioritized findings with evidence, affected scope, remediation, owner, and verification status.

## Stop conditions
Escalate when production access, platform ownership, or destructive URL changes require approval.