# Skill: Retry Side-Effect Analysis

## Purpose
Find external mutations that can be replayed by retries, restarts, interrupts, or subgraph re-execution, then place them behind a stable idempotency boundary.

## Trigger
Any retryable/resumable node that sends email, charges money, writes externally, provisions resources, publishes, deletes, deploys, or mutates remote state.

## Inputs
Graph/node definition, retry policy, interrupt points, checkpoint scope, side-effect APIs, business identifiers, approval requirements.

## Preconditions
The team can identify the business operation independently of an execution attempt.

## Required context
Facts about retry/resume semantics, external system behavior, and authorization boundaries. Hidden chain-of-thought is not requested.

## Allowed tools
Read-only code inspection, checkpoint/trace inspection, deterministic ledger tests, API documentation.

## Constraints
Idempotency MUST NOT replace authorization. A new random key MUST NOT be generated for each retry of the same business operation.

## Procedure
1. Enumerate every externally visible side effect in retryable/resumable code.
2. Record when the runtime can re-enter that code: exception retry, timeout, process restart, interrupt resume, duplicate child scheduling.
3. Identify a stable business key and target.
4. Check whether the external API already supports idempotency; prefer its native guarantee when sufficient.
5. If not, place the operation behind an atomic claim/result ledger.
6. Separate claim, side effect, and result persistence stages.
7. Define crash windows, especially "effect succeeded, result not persisted".
8. Bound retries and require review for stale/ambiguous claims.
9. Test same-process replay, concurrent replay, and process restart.
10. Independently verify no duplicate effect path remains.

## Decision points
- Stable identity unavailable: block and redesign.
- Native API idempotency verified: bind stable key and test replay.
- No native idempotency: use durable claim envelope.
- Stale claim after possible success: do not replay automatically; reconcile first.

## Expected output
Facts, retry boundaries, side-effect inventory, stable identities, crash-window analysis, chosen envelope, test evidence, verification status.

## Metrics
Duplicate effects, retries/operation, claim conflicts, result reuse, stale claims, verification coverage.

## Verification
Independent verifier reproduces replay/restart tests and checks authorization remains separate.

## Failure handling
Maximum three attempts per policy. Ambiguous stale claims block automatic execution and escalate to reconciliation.

## Stop conditions
Stop on missing stable identity, unknown external outcome, exhausted attempts, or any required human approval not obtained.