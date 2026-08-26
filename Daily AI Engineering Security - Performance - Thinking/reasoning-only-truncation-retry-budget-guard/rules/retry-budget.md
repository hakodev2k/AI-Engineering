# Rules: Retry Budget
- Every model retry MUST have an observable failure classification.
- Reasoning-only `finish_reason=length` with zero visible content and zero tool calls MUST NOT be retried unchanged.
- A retry after deterministic output-budget exhaustion MUST change the relevant constraint, such as output budget, reasoning policy, task decomposition, or model routing.
- Zero-usage empty responses MAY be retried only within the configured transient cap.
- Partial truncation MAY be continued only within the configured continuation cap.
- Provider-level and agent-level retries SHOULD share one total attempt budget to prevent multiplicative retry storms.
- The runtime MUST record attempts, latency and token counters for performance verification.
- Hidden reasoning text MUST NOT be logged or exposed; only counters/metadata are permitted.
- Security, correctness and required context MUST NOT be weakened to reduce latency.
