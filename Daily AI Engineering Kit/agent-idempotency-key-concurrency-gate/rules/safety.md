# Idempotency Gate Rules

## MUST
- Prove where the idempotency key is scoped and atomically claimed before declaring duplicate execution prevented.
- Bind a claimed key to a stable request fingerprint when the endpoint accepts request data.
- Preserve evidence for every pass/fail decision.
- Test at least sequential replay, concurrent same-key execution, and same-key/different-payload behavior.
- Keep retry loops bounded to two retries for transient tool/environment failures.
- Require explicit approval for database schema, production configuration, breaking API, destructive, secret, infrastructure, or deployment changes.

## MUST NOT
- Treat an in-memory dictionary as cross-process idempotency for a multi-instance service.
- Perform the protected side effect before durable/atomic ownership is established when duplicates are unsafe.
- Reuse an outcome when the stored and incoming fingerprints differ.
- Run load/concurrency probes against production without explicit approval.
- Log secrets, authorization headers, full payment data, or sensitive request bodies as evidence.
- Force push, delete data, or silently increase permissions.

## SHOULD
- Prefer an existing transactional datastore or atomic cache primitive over a new dependency.
- Scope keys by tenant/principal and operation to avoid cross-context collisions.
- Make retention at least as long as the documented client retry window.
- Return deterministic replay responses where the API contract permits it.
