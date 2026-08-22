# Indexation and Canonicalization

## Purpose
Control which URL variants should be discoverable, indexable, and treated as canonical representatives.

## When to use
Use for duplicate URLs, parameters, syndication, migrations, faceted navigation, or index coverage problems.

## Inputs
URL inventory, canonical tags, redirects, sitemaps, robots directives, internal links, and search-engine diagnostics.

## Context to inspect
Protocol/host variants, parameters, pagination, duplicate templates, canonicals, hreflang, redirects, and sitemap URLs.

## Core knowledge
Canonical tags are signals, not guaranteed commands. Strong canonicalization aligns redirects, links, sitemaps, content, and declared canonicals.

## Procedure
1. Group duplicate or near-duplicate URL families.
2. Choose preferred URLs based on product and user requirements.
3. Inspect current canonical and indexability signals.
4. Resolve contradictory signals.
5. Redirect obsolete duplicates when removal is appropriate.
6. Self-canonicalize stable indexable pages where suitable.
7. Align internal links and sitemaps to preferred URLs.
8. Validate rendered tags and search-engine-selected canonicals.

## Decision points
Use redirects for retired URLs, canonicals for necessary accessible duplicates, and noindex when a page may be crawled but should not appear in search.

## Common failure patterns
Canonicalizing everything to a category root, canonical chains, blocked canonical targets, and sitemap/canonical disagreement.

## Verification
Re-crawl URL families and confirm consistent signals, valid targets, and improving index coverage.

## Expected output
Canonical policy, affected URL patterns, remediation, and validation evidence.

## Stop conditions
Escalate when canonical choices alter product-visible URLs or contractual syndication requirements.