# Rules: Context and Cache Budget

- The next request MUST be budgeted from current context plus pending user, tool, and retrieval content.
- Compaction decisions MUST NOT rely only on the previous model response's token usage when new context has been appended.
- A configurable safety margin MUST be reserved before the hard context limit.
- Post-compaction continuation SHOULD preserve a minimum runway target.
- Correctness-critical requirements, security constraints, unresolved risks, and verification state MUST NOT be removed merely to save tokens.
- Large idle sessions SHOULD be checkpointed or compacted before a likely cold-cache continuation when telemetry shows material cost risk.
- Low cache-read ratio on a large context SHOULD trigger investigation before repeated retries.
- Token optimization MUST be validated against task quality and regression tests.
- Optimization loops MUST be bounded to at most two tuning retries unless a human explicitly authorizes more.
- Missing telemetry MUST fail conservatively rather than claiming an optimization.
