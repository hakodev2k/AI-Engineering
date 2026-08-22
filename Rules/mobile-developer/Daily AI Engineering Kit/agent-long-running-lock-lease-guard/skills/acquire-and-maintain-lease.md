# Skill: Acquire and Maintain a Long-Running Agent Lease

## Purpose
Give one agent/worker temporary mutation ownership over a precisely identified resource while allowing safe crash recovery.

## When to use
Use before long-running workflows that mutate a shared branch, environment, migration/backfill, ticket/work item, external system, deployment slot, generated artifact set, or any resource that must not have concurrent writers.

## Inputs
Resource key, owner identity, scope description, risk, expected duration, lease store, policy, and intended mutation classes.

## Preconditions
- Shared lease store is readable/writable atomically.
- Resource key is canonical and stable.
- Mutation adapters can carry/check a fencing token.
- System clock is trustworthy within configured skew.

## Allowed tools
Read-only discovery; lease scripts; mutation tools only after `evaluate-mutation-gate.py` returns `verified`.

## Constraints
- Never infer ownership from process liveness alone.
- Never extend an expired lease retroactively.
- Never reuse an old fencing token after reacquisition.
- Never bypass provider-native concurrency controls when they exist.

## Procedure
1. Normalize resource scope and save it as JSON.
2. Acquire with `lease_store.py acquire`; fail if another unexpired lease exists.
3. Preserve returned `lease_id`, `fencing_token`, expiry, and scope fingerprint.
4. Before each mutation, build a mutation intent bound to those values.
5. Run `evaluate-mutation-gate.py`; mutate only on `verified`.
6. Heartbeat before the configured interval elapses. Heartbeat may retry once only for transient storage failure.
7. If heartbeat fails twice, stop new mutations immediately and enter recovery.
8. On normal completion, release the lease explicitly.
9. Record verification evidence separately; execution under a valid lease is not proof that the task outcome is correct.

## Expected output
Lease record plus mutation-gate evidence for every protected mutation boundary.

## Verification
Run `validate-lease-state.py`; confirm current token matches the resource's latest token and no later lease exists before claiming current ownership.

## Failure handling
Storage/tool transient failure: retry once. Validation, ownership, expiry, permission, approval or business-rule failure: zero blind retries. Preserve evidence and stop.

## Stop conditions
Stop on ownership mismatch, expired lease, fencing-token mismatch, untrusted clock, missing approval, ambiguous store state, or retry budget exhaustion.
