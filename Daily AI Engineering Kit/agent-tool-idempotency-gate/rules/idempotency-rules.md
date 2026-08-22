# Idempotency Rules

## MUST
- Use one stable idempotency key for all attempts of the same business effect.
- Compute and persist a fingerprint before mutation.
- Reject reuse of a key when its fingerprint differs.
- Claim the ledger before every side-effecting execution.
- Pass the same key to provider-native idempotency support when available.
- Record confirmed success before reporting task success.
- Mark timeouts, connection loss after send, and unknown provider responses as `ambiguous`.
- Reconcile `ambiguous` outcomes with read-only evidence before retry.
- Limit automatic execution retries to two.
- Preserve sanitized evidence for every attempt.
- Require explicit human approval for destructive, production, irreversible, infrastructure, secret, schema, breaking-contract, or history-rewriting actions.

## MUST NOT
- Generate a new key merely because an attempt failed.
- Retry an `ambiguous`, `in_progress`, or `succeeded` intent.
- Store passwords, tokens, connection strings, private keys, or raw secret values in intent arguments, errors, result references, or ledger metadata.
- Treat a timeout as proof that the mutation failed.
- Delete duplicate external effects automatically.
- Increase permissions to make reconciliation succeed.
- Force push, deploy to production, execute destructive SQL, or perform irreversible migration without approval.
- Mark success from model judgment alone; require external evidence.

## SHOULD
- Derive keys from stable business identifiers rather than timestamps.
- Prefer provider-native idempotency plus the local orchestration ledger.
- Use deterministic external IDs that can also be queried during reconciliation.
- Keep result references small and non-secret.
- Use a transactional shared ledger for multi-host or concurrent distributed agents.
- Expire ledger records only according to the longest provider duplicate-risk window and business audit requirements.
