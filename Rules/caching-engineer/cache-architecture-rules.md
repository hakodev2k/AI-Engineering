# Cache Architecture

## Purpose
Define safe cache placement and ownership without turning caches into accidental systems of record.

## Scope
Application, distributed, edge, database-adjacent, and multi-tier caches.

## MUST
- Cache architecture MUST identify source of truth, cache owner, key space, consistency requirement, failure behavior, and invalidation mechanism.
- Every cache MUST have a documented reason tied to measured latency, throughput, availability, or cost needs.
- Multi-tier caches MUST define coherence expectations and maximum acceptable staleness between tiers.
- Cache boundaries MUST follow data ownership and trust boundaries.

## MUST NOT
- A cache MUST NOT become the only durable copy of business-critical data unless explicitly designed and reviewed as durable storage.
- Caching MUST NOT be introduced solely from intuition when the underlying bottleneck has not been measured.
- Independent services MUST NOT mutate another service's cache as a substitute for an owned contract.

## SHOULD
- Prefer the simplest cache topology satisfying the SLO and consistency requirement.
- Keep cache dependencies replaceable where practical.

## Exceptions
Exceptions require documented constraints, alternatives, failure impact, evidence, and owner approval for material production risk.

## Verification
Review architecture diagrams, ownership documentation, SLO evidence, dependency graphs, failure tests, and production metrics.