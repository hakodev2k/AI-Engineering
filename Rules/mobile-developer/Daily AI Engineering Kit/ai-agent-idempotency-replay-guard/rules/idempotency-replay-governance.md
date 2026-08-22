# Idempotency & Replay Governance

## MUST
- Every mutating agent/tool action MUST have a stable `operation_key` before execution.
- `operation_key` MUST be derived from business intent, target identity, action type, and a canonical payload fingerprint; random retry-specific IDs are not valid idempotency keys.
- The workflow MUST check the execution ledger before each initial execution, retry, resume, or replay.
- The ledger MUST distinguish `reserved`, `in-progress`, `succeeded`, `failed-safe-to-retry`, `failed-unknown-outcome`, `blocked`, and `compensated`.
- A timeout/network failure after dispatch MUST be treated as `failed-unknown-outcome` unless provider evidence proves no side effect occurred.
- Reusing an operation key with a different payload fingerprint MUST block execution.
- Completed operations MUST return/reuse the recorded result rather than repeating the side effect when that result is reusable.
- High-risk side effects MUST be independently reviewed when provider idempotency support is absent or outcome is ambiguous.
- Human approval MUST be obtained before compensating destructive/financial/production side effects.

## MUST NOT
- MUST NOT blind-retry mutating actions after ambiguous timeout.
- MUST NOT generate a fresh idempotency key solely because an earlier attempt failed.
- MUST NOT mark an operation `succeeded` from command exit status alone when the external effect requires confirmation.
- MUST NOT delete ledger evidence to unblock a retry.
- MUST NOT reuse one operation key across semantically different targets or payloads.
- MUST NOT silently widen tool permissions to query or compensate an ambiguous operation.

## SHOULD
- Prefer provider-native idempotency keys when available, while retaining the local ledger.
- Prefer deterministic canonical JSON fingerprints excluding volatile metadata such as trace IDs and timestamps unless they affect intent.
- Keep ledger writes atomic where the host storage supports compare-and-set/unique constraints.
- Record provider request IDs, resource IDs, response fingerprints, and verification evidence without secrets.
- Use compensating actions only when duplicate prevention cannot prove the original effect state.
