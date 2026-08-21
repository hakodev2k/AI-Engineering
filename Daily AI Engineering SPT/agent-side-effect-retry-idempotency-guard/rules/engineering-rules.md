# Engineering Rules

## MUST

- Every state-changing logical operation MUST have a stable operation key before dispatch.
- The operation key MUST bind to a canonical argument fingerprint and canonical tool identity.
- Reservation MUST occur before a non-idempotent side effect is dispatched.
- A reused key with a different fingerprint MUST be rejected as a conflict.
- `completed` duplicates MUST reuse/reconcile the recorded result and MUST NOT re-execute the side effect.
- `reserved` or `in_progress` duplicates MUST NOT execute concurrently.
- A timeout, dropped response, worker crash, provider fallback, or transport disconnect after dispatch MUST be represented as `outcome_unknown` unless there is evidence proving the effect did not happen.
- `outcome_unknown` MUST NOT be silently downgraded to `known_failed`.
- Non-idempotent writes with unknown outcomes MUST require either a conclusive side-effect probe, verified downstream idempotency, an approved compensation strategy, or explicit human approval before re-execution.
- Retry count MUST remain bounded even when a call is retry-safe.
- Downstream idempotency MUST be verified from an actual contract/implementation; a field named `idempotency_key` is not sufficient proof.
- The same stable idempotency key MUST be preserved across retries of one logical operation.
- A genuinely new user intent MUST receive a new intent ID rather than inheriting an old key.
- Audit logs MUST record operation key, fingerprint, classification, state transition, attempt count, and decision reason without recording secrets unnecessarily.
- High-risk retry-policy changes MUST receive independent verification.

## MUST NOT

- MUST NOT treat retry budget alone as duplicate-execution protection.
- MUST NOT treat HTTP 5xx/timeout/disconnect as proof of no side effect.
- MUST NOT let the model decide from prose alone whether a previously dispatched non-idempotent action is safe to rerun.
- MUST NOT generate a fresh logical idempotency key for every transport retry.
- MUST NOT replay a completed write merely because its previous response is no longer in model context.
- MUST NOT run a second non-idempotent operation while an equivalent operation remains `in_progress`.
- MUST NOT reuse a key for changed arguments, changed target identity, or changed user intent.
- MUST NOT silently shorten retention below the maximum supported retry/resume window.
- MUST NOT weaken the policy after repeated failures to make automation “finish.”
- MUST NOT store raw credentials, access tokens, or full sensitive tool output in the operation ledger.

## SHOULD

- Read-only tools SHOULD still use operation correlation for observability even when strict deduplication is unnecessary.
- State-changing APIs SHOULD forward the host's logical operation key to a downstream idempotency mechanism when available.
- Durable stores SHOULD use conditional insert/compare-and-set semantics to prevent concurrent duplicate reservations.
- Result replay SHOULD prefer references/digests over copying large or sensitive payloads into the ledger.
- Side-effect probes SHOULD be narrow, deterministic, read-only, and tied to the same operation identity.
- Unknown-outcome probes SHOULD run outside the model reasoning loop where possible.
- Teams SHOULD measure false-block rate and latency overhead so safety does not become an unobserved reliability bottleneck.
- Tool adapters SHOULD expose explicit side-effect classification rather than infer it from names.
- Cancellation and compensation SHOULD be separately audited because they can themselves create side effects.