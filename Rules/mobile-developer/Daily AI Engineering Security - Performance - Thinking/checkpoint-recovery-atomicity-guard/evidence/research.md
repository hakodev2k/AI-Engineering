# Research

## Topic
Checkpoint Recovery Atomicity Guard

## Category
Thinking

## Problem
Agent runtimes that persist checkpoints and pending writes separately can recover into a state that never existed atomically before a crash. The result may be silent duplicate side effects, missing writes, or replay decisions that depend on scheduler timing rather than a durable recovery contract.

## Why it matters now
LangGraph issue #8039 (2026-06-10) provides a reproducible crash scenario where `durability="sync"` can still persist `put_writes` and the superseding checkpoint in an unenforced order. Follow-up issue #8234 (2026-06-30) states that merged ordering fixes still do not guarantee atomicity across partial failures or distributed/Postgres-backed deployments.

## Affected users
Teams running long-lived or stateful agents with checkpoint-based resume, especially agents that trigger non-idempotent external side effects such as payments, messages, deployments, ticket updates, database writes, or job submissions.

## Current public evidence
### Observed evidence
1. `langchain-ai/langgraph#8039` documents a minimal reproducer showing that crash timing can determine whether a node is replayed or treated as durable, with potential duplicate side effects.
2. `langchain-ai/langgraph#8234` explicitly identifies remaining atomicity gaps after ordering fixes, including partial failure, distributed deployments, and lack of one transaction covering pending writes plus checkpoint persistence.
3. `langchain-ai/langgraph#5672` documents cancellation paths where streamed state may not yet be persisted when execution stops, reinforcing that durable state boundaries are not equivalent to visible streamed progress.

### Interpretation
The engineering weakness is not simply “use sync durability.” Reliability requires an explicit recovery invariant that binds checkpoint identity, pending-write identity, side-effect identity, and commit state. Without it, a resumed agent can make an unsupported inference about whether work must replay.

## Existing approaches
- `durability="sync"` to wait more aggressively for persistence.
- Ordering fixes that await writes before superseding checkpoint persistence.
- Idempotency keys in individual tools/services.
- Application-specific reconciliation after restart.

## Remaining limitations
- Ordered writes are not equivalent to transactional atomicity.
- Not every external side effect supports idempotency.
- Recovery logic often trusts checkpoint state without cross-checking side-effect evidence.
- Partial failures can leave checkpoint and write records disagreeing.
- Distributed storage and process death make timing-sensitive races hard to reproduce.

## Root-cause analysis
1. Checkpoint and pending writes are treated as separate durability units.
2. External side effects are not consistently correlated with the checkpoint transition that caused them.
3. Resume logic lacks a machine-readable recovery decision record.
4. Tests validate successful execution more often than kill-at-boundary recovery.
5. Recovery often defaults to replay/retry without proving whether a side effect already committed.

## Improvement opportunity
Add a reusable recovery guard that snapshots a transition ID, records intended side effects, captures commit evidence, validates checkpoint/write consistency before resume, and refuses automatic replay when the durable state is ambiguous. Verification uses deterministic crash fixtures and bounded reconciliation rather than model judgment.

## Goal
Make restart behavior evidence-driven: replay only when non-commit is proven; skip only when commit is proven; otherwise stop for reconciliation.

## Metrics
Ambiguous recoveries, duplicate side effects, missing side effects, checkpoint/write mismatches, crash-fixture pass rate, reconciliation duration, unsupported resume decisions.

## Trigger
Process restart, cancellation recovery, checkpoint load after abnormal termination, or any side-effecting node executed near a checkpoint boundary.

## Inputs
Checkpoint metadata, pending writes, transition IDs, side-effect receipts/idempotency keys, crash marker, workflow policy.

## Outputs
Recovery decision (`replay`, `resume-without-replay`, `block-for-reconciliation`) plus evidence and verification status.

## Relevant sources
- https://github.com/langchain-ai/langgraph/issues/8039
- https://github.com/langchain-ai/langgraph/issues/8234
- https://github.com/langchain-ai/langgraph/issues/5672
