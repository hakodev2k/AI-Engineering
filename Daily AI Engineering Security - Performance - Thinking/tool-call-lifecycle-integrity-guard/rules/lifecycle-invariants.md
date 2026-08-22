# Rules — Tool Call Lifecycle Invariants

- Every tool invocation MUST have a stable unique `call_id` before side effects.
- Canonical arguments MUST be hashed and bound to approval decisions.
- A call ID marked executed MUST NOT execute again.
- Approval MUST be invalidated when call ID, tool identity/version, or canonical argument hash changes.
- Required pre-invocation input guardrails MUST run again after a pause/resume immediately before side effects.
- Tool availability and canonical lookup MUST be revalidated immediately before invocation.
- Executed calls MUST produce exactly one correlated terminal output or error record.
- Orphaned calls and duplicate terminal outputs MUST be surfaced as integrity errors.
- Ambiguous execution status for a high-impact side effect MUST NOT be resolved by blind retry.
- High-impact calls with missing lifecycle evidence MUST fail closed.
- Runtime streaming and non-streaming paths MUST satisfy the same lifecycle invariants.
- Idempotency keys SHOULD be propagated to downstream APIs when supported, but downstream idempotency MUST NOT replace local call-identity checks.
- Security verification MUST include duplicate-call, stale-approval, resumed-guardrail, orphaned-output, and productive happy-path fixtures.
