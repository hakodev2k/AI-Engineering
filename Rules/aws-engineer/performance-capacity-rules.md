# Performance and Capacity Rules
## Purpose
Make AWS performance decisions from measured workload evidence.
## Scope
Latency, throughput, saturation, load testing, quotas, scaling, caching, and service limits.
## MUST
- Define measurable performance objectives for critical paths.
- Benchmark material optimizations against representative before/after conditions.
- Identify service quotas and dependency bottlenecks before expected peak demand.
- Test capacity and degradation behavior at realistic concurrency and data volume.
## MUST NOT
- Claim performance improvement without comparable measurements.
- Increase capacity blindly when evidence indicates another bottleneck.
## SHOULD
- Measure percentiles and saturation rather than relying only on averages.
- Validate caching against correctness, invalidation, and failure behavior.
## Exceptions
Emergency scaling without prior benchmark requires incident justification and post-event validation.
## Verification
Inspect load-test results, CloudWatch metrics, quota settings, traces, cost impact, cache metrics, and before/after evidence.