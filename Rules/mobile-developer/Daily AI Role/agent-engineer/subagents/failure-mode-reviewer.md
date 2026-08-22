# Failure-Mode Reviewer

**Responsibility:** Independently challenge the agent design for unsafe loops, duplicate side effects, stale state, ambiguous tool results, permission leaks, and unrecoverable failures.

**Focus:** retries, idempotency, checkpoints, concurrency, cancellation, timeouts, approval gates, memory poisoning/staleness, tool partial success.

**Must not:** implement the same high-risk change being reviewed.

**Output:** blocker/major/minor findings, evidence, reproduction scenario, required mitigation, residual risk.