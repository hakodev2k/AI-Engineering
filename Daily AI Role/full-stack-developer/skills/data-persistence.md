# Skill: Data Persistence
Purpose: evolve persistence safely while preserving correctness and operability.
Trigger: schema, query, transaction, cache, or data-lifecycle change.
Inputs: data model, access patterns, volume, retention, consistency requirements.
Procedure: identify invariants and ownership; choose transaction boundary; design schema/index changes; evaluate backward/forward compatibility; plan migration/backfill; test concurrency and failure recovery; validate query plans for hot paths; define rollback or roll-forward strategy.
Decisions: prefer additive migrations before destructive cleanup; separate expand and contract for zero-downtime paths; use caching only with explicit invalidation and staleness semantics.
Outputs: schema/query changes, migration plan, verification evidence.
Stop: irreversible transformation without backup/approval, unknown data owner, or unsafe lock/availability impact.