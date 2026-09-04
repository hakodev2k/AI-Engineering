# Workflow: Lease-Fenced Turn Execution

## Trigger
Before any mutation-capable turn in a resumable, multi-client, retrying, or async-delegating agent runtime.

## Goal
Ensure exactly one current mutation owner and reject stale or duplicate work before side effects occur.

## Inputs
Session ID, actor ID, requested mode, current durable lease state, operation ID, and policy.

## Baseline
Measure current concurrent-turn incidents, duplicate operation rate, timeout ambiguity, and stale-owner writes before rollout.

## Context
Read-only followers may coexist. Mutation requires a current lease epoch.

## Stages
1. **Observe** — read durable lease/session state.
2. **Measure baseline** — capture owner, epoch, outstanding operation IDs, and unresolved terminal state.
3. **Diagnose** — determine whether another mutation turn is active or uncertain.
4. **Form hypothesis** — if takeover is required, specify why the previous owner is terminal or can be fenced.
5. **Reconcile** — query durable server/process/checkpoint evidence; do not rely on client timeout alone.
6. **Grant** — atomically advance epoch and bind actor if takeover is safe.
7. **Execute** — every mutation and append carries session, epoch, and operation ID.
8. **Measure again** — record rejected stale writes and duplicates.
9. **Verify** — independent verifier checks event sequence.
10. **Complete** — revoke/close the lease only after terminal evidence is durable.

## Responsible agent
Runtime coordinator implements; `subagents/session-consistency-verifier.md` independently verifies.

## Tools
Durable store/lock primitive, event logger, `scripts/turn_lease_guard.py`, unit tests.

## Outputs
Lease record, event log, decisions, reconciliation evidence, and verification report.

## Checkpoints
Before lease grant; before first mutation; after any timeout; before retry/takeover; before completion.

## Metrics
Concurrent mutation violations, stale writes blocked, duplicate operations blocked, reconciliation latency, recovery success rate.

## Retry policy
Reconciliation may retry at most `max_reconciliation_retries` from policy. A mutation operation itself is not blindly retried.

## Stop conditions
Stop and escalate if current ownership cannot be determined, durable state is unavailable, epoch cannot be atomically advanced, or a stale mutation was accepted.

## Failure path
Fail closed for mutation, preserve evidence, allow read-only inspection where safe, and require operator review for unresolved state.

## Verification
Run deterministic fixtures and compare observed runtime events against the invariant.

## Definition of Done
Baseline captured; lease checks integrated at all mutation paths including background wake; known race fixtures blocked; legitimate follower reads allowed; bounded recovery tested; independent verification complete.