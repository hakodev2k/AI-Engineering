# Rules: Multi-Agent Token and Context Budgets

- Every subagent dispatch MUST have a child-specific context/token budget.
- The child model's actual context-window limit MUST be used; parent limits MUST NOT be assumed.
- Required task constraints, authorization boundaries, and security policy MUST NOT be evicted for token savings.
- Parent history SHOULD NOT be inherited wholesale when a task-specific subset is sufficient.
- Immutable large assets SHOULD be deduplicated by digest/reference when raw content is not required.
- Fan-out MUST NOT proceed when projected aggregate amplification exceeds configured policy.
- Repeated compaction MUST be measured and MUST have a finite threshold.
- Token optimization MUST compare result quality and regression rate, not cost alone.
- Baseline and post-change token/network/latency metrics MUST be recorded.
- Optimization retries MUST be bounded.
