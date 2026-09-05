# Idempotency Safety Rules

## MUST
- Assign a stable idempotency key before every side-effecting tool call.
- Bind each key to exactly one semantic request fingerprint and one tool operation.
- Persist call state before retry-capable execution.
- Preserve `unknown` when commit status is ambiguous.
- Return a durable prior result instead of re-executing an already committed key.
- Run the deterministic gate before declaring replay safety.
- Require independent verification for high/critical side effects.

## MUST NOT
- Reuse one idempotency key for different request content.
- Replay a high/critical unknown outcome merely because the caller timed out.
- Delete or rewrite trace evidence to make a replay pass.
- Treat transport failure as proof that the remote side effect failed.
- Silently increase tool permissions.
- Force push, deploy production, change secrets/infrastructure, weaken security, or perform destructive actions without explicit approval.
- Retry indefinitely.

## SHOULD
- Prefer provider-native idempotency support when its semantics are documented.
- Use cryptographic hashes over canonicalized semantic inputs as fingerprints.
- Store prior result references long enough to cover maximum retry/redelivery windows.
- Keep read-only investigation separate from mutating recovery actions.