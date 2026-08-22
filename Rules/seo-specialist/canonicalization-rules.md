# Canonicalization Rules
## Purpose
Consolidate duplicate or near-duplicate URL signals predictably.
## Scope
Canonical tags, redirects, sitemaps, parameters, and duplicate content.
## MUST
- Select canonicals that are indexable, representative, stable, and consistent with business intent.
- Keep canonical hints, redirects, internal links, and sitemap URLs aligned where practical.
- Validate canonical behavior across representative parameter and duplicate variants.
## MUST NOT
- Canonicalize materially different pages merely to suppress them.
- Point canonicals to broken, redirected, noindex, or inaccessible targets without explicit validated reason.
## SHOULD
- Reduce unnecessary duplicate URL generation rather than depending solely on canonical hints.
## Exceptions
Cross-domain canonicals require documented ownership, content-equivalence, and measurement considerations.
## Verification
Crawler canonical reports, URL inspection, source/rendered HTML, redirect checks, and index sampling.