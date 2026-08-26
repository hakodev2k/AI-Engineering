# Cache Policy Rules

## Purpose
Define safe, predictable CDN caching behavior without sacrificing correctness.

## Scope
Applies to cache keys, TTLs, revalidation, cache-control directives, and origin/CDN policy interactions.

## MUST
- Cacheability MUST be derived from explicit content semantics and data sensitivity.
- Cache keys MUST include every request dimension that can change the representation.
- Shared-cache TTLs MUST have an owner and a documented freshness requirement.
- Revalidation behavior MUST be tested for stale, expired, and changed objects.
- Changes affecting cache keys or TTLs MUST include expected hit-ratio and origin-load impact.

## MUST NOT
- MUST NOT cache personalized or authorization-dependent content unless isolation is proven.
- MUST NOT rely on undocumented vendor defaults for correctness-critical behavior.
- MUST NOT add high-cardinality key dimensions without measuring cache fragmentation.

## SHOULD
- Prefer standards-based Cache-Control semantics where they express the requirement.
- Prefer explicit surrogate policies when edge and browser lifetimes differ.
- Use stale serving only with bounded age and understood failure semantics.

## Exceptions
Exceptions require documented reason, affected traffic, risk, fallback behavior, and reviewer approval when confidentiality or production availability is affected.

## Verification
Inspect response headers and effective CDN configuration; run cache hit/miss/revalidation tests across key variants; compare hit ratio, origin requests, and stale-response metrics before and after material changes.