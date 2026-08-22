# Rules — Prefix Cache Optimization

- A baseline measurement MUST exist before optimization.
- Cache claims MUST use measured provider usage telemetry, not request size alone.
- Weighted cache hit rate and uncached tokens MUST be reported together.
- Long-idle misses MUST be separated from short-gap prefix churn when timestamps are available.
- Stable-prefix fingerprints SHOULD be recorded instead of raw sensitive prompt bodies.
- Tool and schema ordering MUST be deterministic when order is semantically irrelevant.
- Volatile values SHOULD appear after reusable stable content when correctness permits.
- Correctness-, policy-, authorization-, and safety-critical context MUST NOT be removed for cache savings.
- An optimization MUST NOT be marked Verified unless task-quality regression fixtures pass.
- Performance regressions above configured policy thresholds MUST block completion unless explicitly accepted by a human owner.
- Retry loops MUST be bounded to two optimization iterations before re-diagnosis.
- Provider retention behavior MUST NOT be presented as guaranteed unless documented by the provider.
