# Skill: Recover Ambiguous Operation

## Purpose
Resolve a mutation whose client/tool result is unknown after timeout, crash, lost response, or agent resume without causing duplicates.

## Inputs
Operation manifest, ledger record, provider request/resource evidence, last attempt timestamp.

## Procedure
1. Load ledger record by exact operation key.
2. Confirm current payload fingerprint equals the recorded fingerprint. Block on mismatch.
3. Preserve first failure/timeout evidence.
4. Query provider state using request ID, business key, target identity, or read-only lookup.
5. If effect is confirmed, record `succeeded` with verification evidence and do not replay.
6. If provider proves no effect occurred, record `failed-safe-to-retry`; retry at most the policy limit using the same operation key/provider idempotency key.
7. If outcome remains uncertain, record `failed-unknown-outcome` and stop automatic execution.
8. For high-risk operations, hand off to Replay Safety Reviewer.
9. If human-approved compensation is required, execute compensation as a separate operation with its own operation key and ledger record.

## Expected output
Updated ledger evidence and one disposition: `reuse-success`, `safe-retry`, `blocked-unknown`, or `compensation-required`.

## Verification
Run `scripts/evaluate_replay_gate.py` against the manifest and ledger before any resumed mutation.

## Failure handling
Read-only lookup may retry once for transient provider failure. Permission failure, conflicting evidence, or persistent ambiguity stops the workflow.
