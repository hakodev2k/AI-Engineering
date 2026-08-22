# Performance Testing Rules
## Purpose
Make performance conclusions measurable, reproducible, and representative of expected load.
## Scope
Latency, throughput, concurrency, resource usage, endurance, and scalability verification.
## MUST
- Define workload, dataset, environment, metric, percentile, and acceptance threshold before release-critical performance tests.
- Compare changes using equivalent conditions and preserve raw evidence.
- Investigate saturation, errors, and resource constraints alongside response time.
## MUST NOT
- Claim performance improvement from subjective observation or incomparable runs.
- Run disruptive load against production without explicit approval and safeguards.
## SHOULD
- Test realistic concurrency, warm-up, steady state, spikes, and endurance according to risk.
## Exceptions
Microbenchmarks may isolate components but must not be represented as end-to-end capacity evidence.
## Verification
Inspect test configuration, before/after results, percentiles, resource metrics, and environment equivalence.