# Backpressure Rules

- The provider capacity policy **MUST** be the source of truth for concurrency and queue limits.
- A caller **MUST NOT** dispatch when `max_concurrent` is reached unless it enters the bounded queue.
- Queue admission **MUST** fail or shed when queue depth or queue age exceeds policy.
- Retryable failures **MUST** use bounded backoff and **MUST NOT** exceed `max_retries`.
- Permanent authentication, validation, or authorization errors **MUST NOT** be retried.
- Each logical task **MUST** track aggregate tool/model-call and token budgets across retries.
- Deadline expiration **MUST** stop further dispatch when configured.
- A retry **MUST** record the previous error class and retry number.
- Performance claims **MUST** include a baseline and comparable post-change measurement.
- The implementation **SHOULD** prefer load shedding over unbounded queue growth.
- The guard **MUST NOT** weaken permission, validation, or safety checks to improve throughput.
- Every `shed` or `stop` decision **MUST** be observable with a deterministic reason.
