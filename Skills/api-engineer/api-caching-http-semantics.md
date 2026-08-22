# API Caching and HTTP Semantics

## Purpose
Use HTTP caching correctly to reduce latency and backend load without serving unsafe stale data.

## When to use
Use for read-heavy endpoints, conditional requests, CDN integration, or cache-performance work.

## Inputs
Data volatility, sensitivity, freshness requirements, consumer behavior, and intermediary architecture.

## Context to inspect
Cache-Control headers, ETags, Last-Modified, CDN/gateway behavior, authorization, and invalidation paths.

## Core knowledge
HTTP caching depends on explicit freshness and validation semantics. Shared caches require special care for personalized or sensitive responses.

## Procedure
1. Classify response cacheability and sensitivity.
2. Define freshness tolerance.
3. Choose Cache-Control directives.
4. Add validators such as ETag where useful.
5. Support conditional GET and 304 responses.
6. Define Vary dimensions carefully.
7. Review shared-cache safety.
8. Test invalidation and stale behavior.
9. Measure hit ratio and origin reduction.

## Decision points
Use validation when data changes unpredictably; use bounded freshness for stable data. Avoid shared caching for personalized responses unless keys and directives are provably safe.

## Common failure patterns
Caching authenticated data publicly, missing Vary, excessive no-cache usage, stale authorization data, and cache keys that ignore representation variants.

## Verification
Header tests and integration tests confirm cache behavior through actual intermediaries.

## Expected output
A safe, measurable HTTP caching policy.

## Stop conditions
Escalate when freshness or data-classification requirements conflict.