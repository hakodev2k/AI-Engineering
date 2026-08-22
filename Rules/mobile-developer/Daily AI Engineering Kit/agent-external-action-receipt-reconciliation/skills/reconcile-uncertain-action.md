# Reconcile Uncertain External Action

## Purpose
Resolve an uncertain external write outcome without duplicate execution or unsafe compensation.

## Trigger
A write call timed out, disconnected, returned an ambiguous tool error, or produced incomplete acknowledgement.

## Inputs
- `action-attempt.json`
- All receipts for the attempt.
- Reconciliation policy.
- Authoritative status/read-back capability.

## Preconditions
The original idempotency key and request fingerprint are preserved.

## Procedure
1. Mark timeout, connection loss, or missing acknowledgement as `unknown`, never `confirmed-failure`.
2. Freeze automatic replay and compensation while the outcome is unknown.
3. Query the authoritative status/read-back endpoint using the external receipt ID, idempotency key, target identity, or business key.
4. Capture every probe as a new immutable receipt with `transport_status=status-probe`.
5. Verify probe evidence belongs to the exact target and request fingerprint.
6. Run `scripts/evaluate-reconciliation.py` over the ordered receipt set.
7. If confirmed success, select `accept-success`; do not replay.
8. If confirmed failure, select `accept-failure`; only a separate retry policy may authorize a new attempt.
9. If still unknown after one transient probe retry, select `human-decision-required`.
10. For high/critical risk, hand the resolved evidence to the independent Reconciliation Verifier.
11. Run the final gate before claiming the action verified.

## Verification
A terminal decision is supported by authoritative evidence, not transport inference, and is bound to the exact attempt fingerprint.

## Failure handling
- Transient read-only probe failure: retry once, preserving evidence.
- Permission failure: zero retries; stop.
- Deterministic `not found` with documented semantics: record as evidence; do not reinterpret silently.
- Contradictory receipts: stop and require human decision.

## Stop conditions
Outcome remains unknown, receipts bind different attempts, status source is not authoritative, or dangerous follow-up lacks approval.
