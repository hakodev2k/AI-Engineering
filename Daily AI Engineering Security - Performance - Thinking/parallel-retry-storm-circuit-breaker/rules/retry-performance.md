# Retry Performance Rules

1. Retryable failures **MUST** have a finite per-branch and workflow-wide attempt budget.
2. Retry delay **MUST** have a nonzero minimum and **SHOULD** include jitter to prevent synchronized retry bursts.
3. `Retry-After` **MUST** be honored when valid, but a zero or negative value **MUST NOT** create an immediate unbounded loop.
4. Correlated 429/overload responses **MUST** reduce or pause concurrency before further fan-out.
5. Authentication, authorization, invalid-input, and deterministic validation failures **MUST NOT** be automatically retried as transient errors.
6. A circuit breaker **MUST** open when configured failure ratio or global retry budget is exceeded.
7. Recovery from an open circuit **MUST** use bounded half-open probes before restoring concurrency.
8. Successful partial branch outputs **MUST** be checkpointed before aggregate retry/failure when the task permits independent reuse.
9. Performance optimization **MUST** compare against a baseline on the same workload and dependency conditions.
10. Improvement claims **MUST** include useful output, calls, tokens, latency, throughput, and retry/error metrics.
11. Hard agent/iteration caps **MUST NOT** be the only retry-storm control when substantial waste can occur before the cap.
12. Provider rate limits and security controls **MUST NOT** be bypassed for throughput.