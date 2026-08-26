# Workflow: Recover Indeterminate Side Effects
## Trigger
Fence returns `escalate` or `defer` for a mutation whose executor outcome is unclear.
## Goal
Resolve state without causing a duplicate mutation.
## Inputs
Action ID, intended effect, idempotency key, external state.
## Baseline
Do not replay.
## Stages
1. Query external state read-only by stable identifiers.
2. If effect exists, attach evidence and mark `confirmed`.
3. If authoritative evidence proves it failed, mark `failed`.
4. Otherwise mark `indeterminate`.
5. If idempotency is proven and policy permits, request human approval before replay when consequence is high.
6. Rerun fence once.
## Retry policy
Maximum 1 reconciliation rerun.
## Stop conditions
Conflicting state, missing idempotency for an irreversible action, or unresolved evidence.
## Failure path
Escalate with evidence; keep compaction blocked if state must survive.
## Verification
Independent reviewer confirms resolution.
## Definition of Done
No mutation remains silently ambiguous.
