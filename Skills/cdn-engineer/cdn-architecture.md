# CDN Architecture

## Purpose
Design a CDN topology that reduces latency and origin load while preserving correctness, security, and operability.

## When to use
Use for new CDN deployments, major traffic growth, multi-region expansion, or architecture reviews. Do not redesign solely from vendor defaults without workload evidence.

## Inputs
Traffic geography, object types, request volume, latency SLOs, origin topology, compliance constraints, cost targets.

## Context to inspect
Existing DNS and routing, cache hierarchy, origins, TLS termination, application semantics, observability, failover paths, vendor limits.

## Core knowledge
CDNs combine globally distributed edge POPs, request routing, caching, shielding, connection reuse, and edge compute. Architecture must balance hit ratio, freshness, availability, latency, cost, and failure blast radius.

## Procedure
1. Classify traffic by cacheability, size, sensitivity, and geography.
2. Establish latency, availability, freshness, and cost objectives.
3. Map clients, edge POPs, shields, origins, and dependencies.
4. Define routing and origin-selection behavior.
5. Define cache keys, TTL ownership, and bypass rules.
6. Decide whether origin shielding and tiered caching are justified.
7. Design failover without creating retry storms.
8. Define security boundaries and TLS termination.
9. Add metrics for edge, shield, and origin layers.
10. Load-test representative traffic and failure scenarios.
11. Document architecture decisions and rollback paths.

## Decision points
Use shielding when origin fan-out or miss traffic is costly. Prefer fewer cache-key dimensions unless representation correctness requires them. Multi-CDN is justified by resilience, geography, commercial leverage, or specialized capability—not fashion.

## Common failure patterns
Cache-key explosion, accidental private-content caching, unbounded origin failover, weak purge strategy, routing loops, hidden single-origin dependencies, and architecture without observability.

## Verification
Confirm SLOs under normal and degraded conditions, measure hit ratio and origin offload, test failover, and validate cache correctness with representative requests.

## Expected output
A documented CDN topology, routing policy, cache strategy, resilience model, observability plan, and verified performance baseline.

## Stop conditions
Escalate when requirements conflict, private-data handling is unclear, DNS ownership is unavailable, or a proposed change risks uncontrolled production impact.