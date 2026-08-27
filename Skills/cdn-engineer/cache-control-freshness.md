# Cache Control and Freshness

## Purpose
Define predictable freshness behavior across browsers, shared caches, shields, and origins.

## When to use
Use when setting TTLs, correcting stale content, increasing offload, or separating browser and CDN caching.

## Inputs
Content update frequency, freshness tolerance, cache headers, purge capability, revalidation behavior, SLOs.

## Context to inspect
Origin Cache-Control, Expires, ETag, Last-Modified, CDN overrides, stale directives, application release model.

## Core knowledge
Freshness is controlled by HTTP semantics plus CDN policy. `s-maxage`, `max-age`, validators, `stale-while-revalidate`, and `stale-if-error` serve different operational goals.

## Procedure
1. Classify resources by mutability and freshness requirement.
2. Identify the authoritative TTL owner.
3. Separate browser TTL from shared-cache TTL where useful.
4. Add validators for efficient revalidation.
5. Use stale serving only within explicit business tolerances.
6. Avoid CDN overrides that silently contradict origin intent.
7. Define purge requirements for exceptional updates.
8. Test fresh, stale, revalidated, and error states.
9. Measure origin requests and stale-response behavior.

## Decision points
Prefer long TTL plus purge for immutable/versioned assets. Prefer revalidation or short TTL when updates are unpredictable and purge cannot be guaranteed.

## Common failure patterns
Conflicting headers, caching `no-store` responses, relying on default TTLs, excessive zero-TTL revalidation, and stale serving beyond acceptable windows.

## Verification
Inspect response headers at each layer, age progression, conditional requests, and behavior after TTL expiry and origin failure.

## Expected output
A freshness policy with explicit TTLs, validators, stale rules, purge assumptions, and tests.

## Stop conditions
Escalate if business freshness tolerance is undefined or compliance forbids storage at shared edges.