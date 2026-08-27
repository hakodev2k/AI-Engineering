# Gateway Caching

## Purpose
Reduce backend load and latency with safe HTTP-aware gateway caching.

## When to use
Use for cacheable read traffic after measuring repeated demand and backend cost.

## Inputs
Endpoint semantics, cache headers, personalization rules, freshness requirements, traffic metrics.

## Context to inspect
Authorization, Vary behavior, invalidation options, payload size, stale tolerance, downstream caches.

## Core knowledge
Understand cache keys, freshness, validators, private/public responses, stale serving, invalidation, and cache poisoning risks.

## Procedure
1. Prove the response is safe to cache.
2. Define a key including all representation-changing dimensions.
3. Respect or deliberately override origin cache policy with documented rationale.
4. Prevent authenticated data from crossing identities or tenants.
5. Set bounded TTL and stale behavior.
6. Define purge/invalidation when required.
7. Instrument hit ratio, age, evictions, and backend savings.
8. Test variant and authorization isolation.

## Decision points
Prefer origin-controlled caching for clear HTTP semantics; gateway overrides only when centrally justified. Avoid caching highly personalized or rapidly mutable data unless isolation and freshness are explicit.

## Common failure patterns
Incomplete cache keys, caching error responses unintentionally, tenant leakage, indefinite stale content, optimizing before measuring.

## Verification
Confirm correctness across identities and variants, hit ratio under load, and invalidation behavior.

## Expected output
A safe cache policy with measurable latency/capacity benefit.

## Stop conditions
Escalate if representation or authorization dimensions are ambiguous.