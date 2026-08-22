# Internal Linking Architecture

## Purpose
Design internal links that help users navigate, distribute discovery signals, clarify hierarchy, and surface important pages.

## When to use
Use during architecture changes, content expansion, orphan-page remediation, or authority consolidation.

## Inputs
URL inventory, crawl graph, templates, priority pages, content taxonomy, and user journeys.

## Context to inspect
Navigation, breadcrumbs, contextual links, pagination, orphan URLs, click depth, anchor text, and templated link blocks.

## Core knowledge
Internal links influence discovery and context but must primarily make navigational sense. Sitewide links can amplify both good and bad architecture decisions.

## Procedure
1. Identify strategic destinations and topic relationships.
2. Map current crawl paths and orphan pages.
3. Evaluate click depth and template-generated links.
4. Add contextual links where they aid the reader.
5. Improve hierarchy through navigation and breadcrumbs where justified.
6. Use descriptive, natural anchors.
7. Remove misleading, broken, or excessive links.
8. Re-crawl and compare graph changes.

## Decision points
Use contextual links for semantic relationships; use navigation for persistent user tasks. Avoid sitewide promotion when relevance is weak.

## Common failure patterns
Automated keyword anchors, footer link farms, linking every page to every page, and ignoring orphaned high-value URLs.

## Verification
Confirm links render as crawlable anchors, priority URLs become discoverable, and user navigation remains coherent.

## Expected output
A prioritized internal-link plan with template and contextual changes plus crawl verification.

## Stop conditions
Escalate when navigation changes affect product information architecture ownership.