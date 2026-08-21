# Rules — Side-Effect Consistency

- Every side-effecting operation **MUST** carry a stable logical operation ID across retries, fallbacks, model switches, and parent-turn recovery.
- Every side-effecting operation **MUST** validate its expected session revision immediately before execution.
- A revision mismatch **MUST** trigger reconciliation before any retry or replacement action.
- A committed receipt for the same logical operation **MUST** be returned instead of executing the side effect again.
- A cancelled, timed-out, interrupted, or missing parent response **MUST NOT** be treated as proof that the side effect did not execute.
- Started or unknown operations **MUST** be reconciled against durable state before retry.
- Model-visible transcript history **MUST NOT** be the only source of truth for external execution state.
- Retry/fallback machinery **MUST** preserve operation lineage even when assistant/tool messages are retracted or regenerated.
- Parallel read-only work **SHOULD** remain permitted when it cannot mutate shared session or external state.
- Side-effecting turns **SHOULD** use a single-writer lease or compare-and-swap revision boundary.
- Equivalent actions **SHOULD** be detected using a canonical action fingerprint in addition to raw tool-call IDs.
- Receipt stores **MUST NOT** contain secrets or full sensitive payloads when a hash/reference is sufficient.
- If session revision or receipt storage is unavailable, side-effecting execution **MUST** fail closed.
- Reconciliation retries **MUST** be bounded to the configured maximum and **MUST NOT** loop indefinitely.
- Conflicting committed actions **MUST** block automation and require explicit higher-level resolution.
