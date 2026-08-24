# Rules — Model-Bucket Backpressure

1. Every model-backed child request MUST be assigned to an explicit `(provider, model, quota-domain)` bucket before dispatch.
2. A baseline MUST exist before claiming that a concurrency change improves performance.
3. The orchestrator MUST enforce a finite per-bucket in-flight limit.
4. HTTP 429 responses MUST reduce or hold bucket concurrency; they MUST NOT trigger immediate unbounded retries.
5. A valid `Retry-After` value MUST be honored as the minimum retry delay.
6. Retry delay MUST include bounded jitter when multiple children can retry the same bucket.
7. Total attempts per logical child MUST be bounded. Default maximum: 3 attempts unless a stricter host policy exists.
8. Failed children MUST preserve failure evidence; they MUST NOT be converted to empty successful results.
9. Model fallback MUST NOT occur unless an explicit compatibility policy confirms required capabilities, context size, tool support, and quality tier.
10. A fallback MUST be observable in trace output and final metrics.
11. The governor SHOULD decrease concurrency quickly after throttle signals and increase it conservatively after sustained success.
12. The implementation MUST distinguish provider throttling, usage-credit exhaustion, authentication failure, and transient network failure.
13. Performance success MUST require equal-or-better useful completion rate and lower throttle/retry amplification, not merely fewer requests.
14. Security, approval, and tool-permission boundaries MUST remain unchanged by performance tuning.
