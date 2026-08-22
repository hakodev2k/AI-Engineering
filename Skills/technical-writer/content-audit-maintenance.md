# Content Audit and Maintenance

## Purpose
Keep a documentation corpus accurate, owned, discoverable, and free of harmful duplication or obsolete guidance.
## When to use
Use periodically, before migrations, after major releases, or when stale content accumulates.
## Inputs
Content inventory, analytics, support policy, ownership, release history, link reports.
## Context to inspect
Last meaningful review, product versions, duplicate topics, traffic, search, orphan pages, redirects.
## Core knowledge
Maintenance is risk management. Prioritize content by user impact, change rate, criticality, and confidence rather than reviewing every page equally.
## Procedure
1. Inventory pages with metadata and ownership.
2. Classify keep, update, consolidate, archive, or delete.
3. Prioritize critical/high-traffic/high-change content.
4. Compare claims with current product/source truth.
5. Consolidate duplicate canonical topics.
6. Add redirects before deleting/moving URLs.
7. Assign owners and review triggers.
8. Automate stale-link and structural detection.
9. Track debt and recurring root causes.
## Decision points
Archive content users still need for supported versions; delete obsolete content when redirects and historical obligations are handled.
## Common failure patterns
Using last-modified date as accuracy proof, mass deletion without redirects, cosmetic reviews, and ownerless critical docs.
## Verification
Sample high-risk pages against current behavior and confirm redirects/search no longer expose superseded guidance.
## Expected output
Reduced documentation debt with explicit ownership and lifecycle state.
## Stop conditions
Escalate deletion where contractual, legal, or supported-version retention is uncertain.