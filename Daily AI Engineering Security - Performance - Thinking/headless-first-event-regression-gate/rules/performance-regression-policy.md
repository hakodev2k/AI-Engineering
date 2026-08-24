# Performance Regression Policy

- A headless client upgrade MUST have a pre-change baseline captured with the same workload used for candidate measurement.
- Comparisons MUST include first-byte latency, total latency, failures/timeouts, client version and sample count.
- The benchmark MUST use at least five measured samples after warmup unless a stricter local policy applies.
- Timeout samples MUST remain failures; they MUST NOT be discarded from the dataset.
- Teams MUST NOT claim an optimization from total duration alone when first-event and downstream work cannot be distinguished.
- Thresholds MUST NOT be relaxed solely to make a candidate pass.
- A regression above the configured median or p95 gate MUST block rollout until explicitly accepted by a human owner or corrected.
- Version pinning SHOULD be time-bounded and accompanied by an upstream/reference issue when the regression is vendor-side.
- Security or correctness controls MUST NOT be disabled to improve latency.
- Every accepted change SHOULD retain raw benchmark JSON for later trend comparison.
