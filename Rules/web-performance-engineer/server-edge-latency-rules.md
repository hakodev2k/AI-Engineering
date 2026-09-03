# Server and Edge Latency Rules

## Purpose
Control backend and edge delays that determine how quickly browsers can begin useful work.

## Scope
Applies to TTFB, origin processing, edge compute, server rendering, cache misses, redirects, and geographic latency.

## MUST
- Decompose TTFB into network, edge, origin, and application components before optimization.
- Measure latency at representative percentiles and regions.
- Preserve correctness, authorization, and consistency when moving work to an edge layer.
- Define fallback behavior for edge or origin degradation.

## MUST NOT
- Attribute browser loading problems to frontend code when server timing evidence shows the dominant delay is upstream.
- Replicate sensitive data to edge locations without required security and residency review.
- Claim server latency improvement from local benchmarks alone.

## SHOULD
- Cache or precompute stable work when invalidation semantics are clear.
- Minimize serial upstream dependencies on initial document delivery.

## Exceptions
Exceptions require measured impact, architecture rationale, data/security review where relevant, and rollback planning.

## Verification
Use Server-Timing, distributed traces, regional probes, origin metrics, CDN analytics, and end-to-end waterfalls.