# Rules: Resume Cardinality Contract

- Every live interrupt **MUST** have a stable unique ID before presentation.
- Nested/task-grouped interrupts **MUST** be flattened by interrupt ID for cardinality checks.
- A scalar resume **MUST NOT** be accepted when more than one interrupt is pending.
- A mapped resume **MUST** address every live pending interrupt exactly once unless the protocol explicitly supports a documented partial-resume transaction with persistent unconsumed state.
- Unknown, stale, or duplicate response IDs **MUST** block the resume.
- The runtime **MUST NOT** bind a response by list position, task order, or “first pending” when multiple interrupts exist.
- Validation **MUST** occur before any response is consumed or any approved side effect executes.
- Batch consumption and durable state update **SHOULD** be atomic; when atomicity is unavailable, each applied ID **MUST** be durably journaled before continuation.
- Approval, rejection, cancellation, and unresolved states **MUST** remain distinct.
- After resume, the host **MUST** reconcile all addressed IDs against terminal outcomes before another model decision depends on them.
- Retry **MUST** be bounded to one refreshed-state retry for concurrent drift.
- A failed check **MUST NOT** be bypassed by silently dropping sibling interrupts.