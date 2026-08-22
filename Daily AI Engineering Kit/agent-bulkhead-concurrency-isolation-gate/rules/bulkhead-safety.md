# Bulkhead Safety Rules

## MUST
- Keep every concurrency limit finite and greater than zero.
- Keep every queue bounded.
- Set queue timeout lower than execution timeout.
- Keep retry limits finite and account retries against the caller deadline.
- Preserve evidence for rejected, timed-out, failed, and completed executions.
- Isolate high-risk or slow dependencies from latency-sensitive workloads when they share capacity.
- Require explicit human approval before changing production capacity, disabling isolation, changing infrastructure, or increasing permission scope.
- Fail closed when required policy fields are invalid or missing.

## MUST NOT
- Use an unbounded queue.
- Retry bulkhead rejection indefinitely.
- Increase concurrency solely to hide downstream saturation.
- Share one mutable semaphore/pool across unrelated trust or tenant boundaries without evidence that the coupling is safe.
- Disable timeout, cancellation, or rejection handling to increase throughput.
- Deploy production policy changes automatically.
- Log secrets, credentials, tokens, or sensitive payload bodies in evidence artifacts.

## SHOULD
- Prefer separate partitions for materially different SLOs or dependencies.
- Use load tests that overload one partition and assert healthy partitions remain within their latency/error budgets.
- Start conservatively and tune from measured saturation evidence.
- Emit queue depth, active permits, rejections, timeouts, and completion latency as metrics.
- Keep policy changes reviewable in source control.
