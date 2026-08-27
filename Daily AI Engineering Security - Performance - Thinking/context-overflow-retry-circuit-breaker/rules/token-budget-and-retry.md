# Rules: Token Budget and Retry

- Every model request MUST have a preflight estimate for input, reserved output, safety margin, and model context limit.
- Immutable context and evictable context MUST be measured separately.
- Deterministic context-capacity failures MUST be classified before generic retry logic.
- The same oversized request signature MUST NOT be retried more than the configured limit.
- Compaction MUST be followed by a new token measurement before another model request.
- Compaction MUST show measurable progress; otherwise the workflow MUST fail fast.
- Security policy, user requirements, test criteria, and correctness-critical facts MUST NOT be removed solely to save tokens.
- Compaction and retry loops MUST have bounded attempts and explicit stop conditions.
- Provider-specific error strings SHOULD augment, not replace, preflight budget checks.
- Metrics MUST include tokens/task, retry count, latency, cost, overflow recovery rate, and quality regression where measurable.
