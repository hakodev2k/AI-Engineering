# Parallel Batch Invariants

- Every model-issued parallel tool batch MUST receive a durable `batch_id` before execution.
- Every tool call MUST retain its original `tool_call_id` across approval, retry, transport, and handoff boundaries.
- Every tool call MUST reach exactly one terminal state: `succeeded`, `failed`, `rejected`, or `cancelled`.
- A tool result MUST NOT be fabricated to hide a missing execution.
- A continuation after human approval MUST reuse or durably restore the session state that owns pending sibling calls.
- Shared mutable agent/session state MUST NOT be written concurrently unless the operation is proven commutative or protected by an explicit version/transaction rule.
- Stateful commits SHOULD use an observed `session_version` and fail on stale versions rather than silently overwriting newer state.
- Handoff commit and reply generation MUST NOT race when the reply depends on the active-agent identity; one explicit ordering barrier MUST exist.
- Retried side-effecting calls MUST have a stable idempotency key or MUST require human review before retry.
- A failed or rejected sibling MUST NOT consume another sibling's checkpoint, approval, or terminal-result slot.
- The system MUST measure sequential and parallel baselines before claiming a performance improvement.
- Correctness gates MUST NOT be removed merely to reduce latency.
- Recovery loops MUST be bounded to two remediation attempts per batch.
- Completion MUST be blocked when the analyzer reports lost calls, duplicate starts, non-terminal calls, or impossible event ordering.
