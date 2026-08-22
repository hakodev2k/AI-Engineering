# External Action Reconciliation Governance

## MUST
- Pre-register each logical external write with exact target, idempotency key, request fingerprint, and risk.
- Treat timeout, disconnect, and missing acknowledgement as `unknown` until authoritative read-back proves otherwise.
- Preserve immutable receipts for the initial write and every reconciliation probe.
- Reuse an idempotency key only when the material request fingerprint is identical.
- Block replay and compensation while the outcome is `unknown`.
- Use an authoritative status/read-back source before deciding whether to retry.
- Require independent verification for high/critical risk decisions.
- Require explicit human approval before production deployment, destructive/data-changing actions, infrastructure/secret changes, breaking contracts, irreversible migrations, or other dangerous actions.
- Bind review and approval to the exact attempt fingerprint.
- Distinguish `executed`, `reconciled`, and `verified`.

## MUST NOT
- Infer business failure from HTTP/client timeout alone.
- Create a new idempotency key merely because the response was lost.
- Replay a write to discover whether the first write succeeded.
- Compensate an action whose original outcome remains unknown.
- Fabricate external receipt IDs or status evidence.
- Treat logs from a non-authoritative cache as proof when an authoritative API exists.
- Increase permissions silently.
- Allow the acting agent to be the only verifier for high/critical risk.
- Retry deterministic permission/validation errors as transient failures.
- Exceed one retry for a transient read-only status probe.

## SHOULD
- Prefer provider-native idempotency keys and operation/status resources.
- Store only redacted evidence needed for reconciliation.
- Use business keys plus target identity as secondary correlation evidence.
- Make retry a new explicit decision after confirmed failure, not a continuation of an unknown attempt.
- Keep compensation as a separately approved action with its own receipt chain.
