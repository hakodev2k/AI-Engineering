# Rules — Agent Retry Budget

- Every agent task MUST have a shared retry budget that spans model, tool, auth, retrieval, and subagent layers.
- Retry ownership MUST be explicit; nested layers MUST NOT each apply independent unbounded retries.
- Retries MUST be limited by both per-operation and task-wide budgets.
- Retries MUST use bounded exponential backoff with jitter unless a trusted `Retry-After` value is present.
- Non-idempotent operations MUST NOT be retried automatically without an idempotency mechanism that makes duplicate side effects impossible.
- Authentication, authorization, validation, and other explicitly non-retryable failures MUST fail fast.
- Circuit-open state MUST block further calls until the configured cool-down or an explicit operator override.
- Retry logic MUST emit observable counters for original attempts, retries, delay, reason, and final outcome.
- Performance claims MUST include before/after call counts and task latency; successful completion alone MUST NOT be called an optimization.
- Retry-budget exhaustion MUST stop the autonomous loop rather than silently resetting the budget.
- Security or correctness checks MUST NOT be disabled to reduce retry latency.
