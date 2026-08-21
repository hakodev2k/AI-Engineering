# Skill: Approval Use Verification

## Purpose
Verify that an approval is valid for the exact action about to execute and that it has not expired, been revoked, consumed, or widened beyond its approved scope.

## Inputs
- approval request
- approval record
- current execution intent
- approval policy
- consumption ledger

## Preconditions
No protected side effect has executed for the current intent.

## Procedure
1. Canonicalize the current execution intent using the same normalization rules used for the request.
2. Recompute the action fingerprint.
3. Verify request ID, revision, action fingerprint, policy version, target, environment, scope, and payload binding.
4. Verify approval status is `approved` and not `revoked`.
5. Compare current UTC time to `approved_at` and `expires_at`.
6. Verify approver identity/role and independence requirements.
7. For `single-use`, verify the fingerprint has no successful prior consumption.
8. For reusable approvals, verify remaining uses, reuse window, and unchanged scope/payload.
9. Run `scripts/evaluate-approval-gate.py` before execution.
10. If allowed, execute exactly the bound action.
11. Immediately append a consumption record containing request ID, revision, fingerprint, executor, start/end timestamps, result, and evidence reference.
12. Run the gate again after ledger append; the next identical single-use execution must be blocked.

## Expected output
A gate result of `allow`, `human-approval-required`, or `block`, plus an immutable consumption record after execution.

## Verification
Successful execution is not equivalent to valid approval. Validity is proven by matching fingerprints, time window, scope, approver constraints, and consumption state.

## Failure handling
- Expired/revoked/consumed: stop and request a new approval.
- Fingerprint mismatch: stop; create a new request revision.
- Missing ledger: fail closed.
- Clock parse failure: fail closed.

## Stop conditions
Never execute when the gate does not return `allow`.