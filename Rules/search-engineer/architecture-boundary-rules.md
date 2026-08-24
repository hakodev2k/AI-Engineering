# Architecture Boundaries

## Purpose
Keep search concerns cohesive and prevent the search engine from becoming an accidental system of record or business-logic hub.

## Scope
Service boundaries, source ownership, retrieval interfaces, indexing contracts, and dependency direction.

## MUST
- Identify the authoritative source for every indexed business fact.
- Keep indexing and query contracts explicit between source systems and search components.
- Place authorization, business invariants, and transactional truth in their owned systems unless search has an explicitly designed responsibility.
- Document material architecture trade-offs for new retrieval stores, ranking services, or cross-domain indexes.

## MUST NOT
- Treat an eventually consistent search index as the authoritative transactional database without an explicit architecture decision.
- couple unrelated domains through undocumented shared index fields.
- expose search-engine implementation details as unavoidable domain contracts.

## SHOULD
- Design replaceable boundaries around engine-specific APIs.
- Keep domain ownership visible in schema and ingestion design.

## Exceptions
Exceptions require constraints, alternatives considered, operational risk, migration path, and architecture approval.

## Verification
Review architecture diagrams/decisions, dependency graphs, source ownership, API contracts, and failure-mode behavior.