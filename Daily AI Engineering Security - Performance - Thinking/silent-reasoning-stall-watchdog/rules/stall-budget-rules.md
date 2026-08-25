# Stall Budget Rules

- A performance claim **MUST** have a pre-change baseline from the same adapter/model/workload class.
- A `Thinking` UI state **MUST NOT** be treated as proof of progress.
- Hidden/private reasoning content **MUST NOT** be requested, logged, or used as a progress signal.
- A host **MUST** distinguish `last_event_age` from `last_visible_progress_age` when observable.
- A token-burn alarm **MUST** use cumulative usage deltas, not estimated hidden reasoning text.
- Recovery **MUST** be bounded to at most two automated retries unless a human explicitly raises the limit.
- A retry **MUST NOT** repeat the same adapter/path unchanged after the same classified stall twice.
- If a mutating tool may still be active, cancellation **MUST** reconcile side effects before replay.
- Thresholds **SHOULD** be derived from p95 known-good traces and recorded with the benchmark.
- Optimization **MUST NOT** weaken sandbox, approval, authentication, or required-context boundaries.
- Completion **MUST** separate Implemented, Measured, and Verified status.
