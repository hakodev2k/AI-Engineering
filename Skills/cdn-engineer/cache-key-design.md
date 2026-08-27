# Cache Key Design

## Purpose
Design cache keys that maximize reuse without serving the wrong representation or crossing security boundaries.

## When to use
Use when onboarding endpoints, debugging low hit ratio, introducing variants, or reviewing cache correctness.

## Inputs
Request examples, response variation rules, headers, cookies, query parameters, authentication behavior, current hit/miss metrics.

## Context to inspect
Origin routing, framework cache headers, CDN configuration, personalization, localization, device variants, signed URLs.

## Core knowledge
A cache key defines representation identity. Every unnecessary dimension fragments cache; every omitted meaningful dimension risks content confusion or leakage.

## Procedure
1. Identify the resource identity and all legitimate representation variants.
2. Enumerate URL, query, header, cookie, host, protocol, and device inputs.
3. Prove which inputs actually change the response.
4. Normalize equivalent inputs where safe.
5. Exclude tracking and irrelevant parameters.
6. Separate authenticated or personalized traffic unless explicitly safe to cache.
7. Bound high-cardinality dimensions.
8. Implement the smallest correct key.
9. Test pairs of requests that should collide and should not collide.
10. Observe hit ratio and correctness after rollout.

## Decision points
Vary on headers or cookies only when they materially select representations. Prefer URL normalization over proliferating keys when semantics permit.

## Common failure patterns
Including all query parameters, varying on entire cookie headers, ignoring host, mixing authenticated users, case-normalization mistakes, and unbounded locale/device variants.

## Verification
Use synthetic request matrices and cache-status headers to prove expected key equivalence and separation; monitor hit ratio and wrong-content reports.

## Expected output
A documented cache-key specification with normalization rules, exclusions, tests, and measured impact.

## Stop conditions
Stop if representation semantics cannot be established or user-specific data could be cached without an approved isolation model.