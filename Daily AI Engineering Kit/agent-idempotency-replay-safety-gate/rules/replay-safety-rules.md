# Replay Safety Rules

## MUST
- Identify every durable/external side effect before declaring an operation replay-safe.
- Use the same logical idempotency key across retries.
- Enforce deduplication atomically for concurrent attempts; a check-then-act query without a uniqueness/transaction guarantee is insufficient.
- Preserve evidence for the commit-succeeded/acknowledgement-lost failure mode.
- Test both sequential and concurrent duplicate delivery.
- Keep facts, hypotheses, decisions, and open questions distinct.
- Require explicit human approval for schema changes, destructive SQL, production mutation/configuration, breaking contracts, data deletion, security weakening, and irreversible migrations.

## MUST NOT
- Claim exactly-once delivery when only at-least-once delivery plus idempotent processing is demonstrated.
- Use in-memory locks/cache as the only protection for distributed durable side effects.
- Generate a fresh idempotency key inside a retry loop.
- Retry non-idempotent external mutations blindly after an ambiguous timeout.
- Log secrets, credentials, full authorization headers, or sensitive request bodies as evidence.
- Modify unrelated files or bypass failing tests.
- Force push, rewrite Git history, or deploy to production as part of this workflow.

## SHOULD
- Prefer database unique constraints and transactional claims over application-only checks.
- Prefer outbox/inbox patterns for message boundaries.
- Store a request fingerprint to detect key reuse with a changed payload.
- Return the original result for completed duplicates when the API contract permits it.
- Bound idempotency retention to an explicitly documented replay window.
- Keep changes minimal and compatible with existing architecture.
