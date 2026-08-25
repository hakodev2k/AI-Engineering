# Rules: Backpressure Recovery Policy

1. The client **MUST** preserve HTTP status, structured provider error code/type, `Retry-After`, provider/model identity, and recovery attempt metadata before generic exception normalization.
2. A retry/fallback decision **MUST NOT** be based on HTTP status alone when structured error metadata is available.
3. `Retry-After` **MUST** be honored within configured safety bounds unless policy explicitly classifies the response as non-retryable.
4. Local admission pressure **MUST NOT** trigger credential rotation or model/provider fallback before the bounded local wait policy is exhausted.
5. Provider-capacity failures **SHOULD** use configured fallback after bounded same-provider retries when the fallback preserves task requirements.
6. Burst-rate controls **MUST** use jittered delay and **SHOULD** reduce request ramp/concurrency; synchronized immediate retries are prohibited.
7. One logical request **MUST** have one cumulative recovery budget shared across retry-capable layers.
8. Recovery loops **MUST** have explicit maximum attempts and maximum elapsed time.
9. The system **MUST** record action, reason code, delay, attempt, and cumulative elapsed time for every recovery decision.
10. Unknown capacity failures **MUST** use conservative bounded recovery and **MUST NOT** retry indefinitely.
11. Performance changes **MUST** capture baseline and after-state metrics before claiming improvement.
12. Fallback **MUST NOT** select a model/provider that violates security, data-location, quality, or user-selected constraints merely to improve availability.
