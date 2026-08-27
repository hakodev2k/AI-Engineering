# Architecture Boundaries
## Purpose
Keep stream-processing responsibilities explicit and evolvable.
## Scope
Pipeline boundaries, ownership, coupling, contracts, and topology design.
## MUST
- Each pipeline MUST have defined input contracts, output contracts, state ownership, and operational owner.
- Business invariants MUST be enforced at a boundary capable of observing all required facts.
- Architecture changes affecting ordering, consistency, replay, or data ownership MUST document trade-offs and migration impact.
## MUST NOT
- Hidden coupling through undocumented topics, tables, state, or side effects MUST NOT be introduced.
## SHOULD
- Topologies SHOULD isolate independently scalable or failure-prone responsibilities when operational value exceeds complexity.
## Exceptions
Cross-boundary coupling requires rationale, owner agreement, and verification strategy.
## Verification
Review topology diagrams/contracts, dependency graph, ownership, failure boundaries, and architecture decision records.