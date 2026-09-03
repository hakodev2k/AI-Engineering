# Performance and Latency Rules

## Purpose
Prevent feature-flag evaluation from becoming a material latency or throughput bottleneck.

## Scope
Applies to local evaluation, remote evaluation, cache access, SDK polling/streaming, context construction, and event emission.

## MUST
- Evaluation latency budgets MUST be defined for latency-sensitive request paths.
- Flag evaluation on hot paths MUST avoid unnecessary network round trips when local or cached evaluation is available.
- Performance changes MUST be supported by before/after measurements under representative load.
- High-cardinality context construction and telemetry costs MUST be measured before broad rollout.
- SDK refresh and streaming behavior MUST be configured to avoid resource exhaustion.

## MUST NOT
- MUST NOT claim flag-platform performance improvement without measurement.
- MUST NOT perform repeated identical evaluations or client construction in a tight loop when results or clients can be safely reused.
- MUST NOT allow telemetry backpressure to block critical application work indefinitely.

## SHOULD
- Benchmarks SHOULD include cold start, steady state, provider outage, and cache-miss scenarios.

## Exceptions
Remote evaluation may be required for centralized policy or sensitive logic when the latency trade-off is explicitly accepted.

## Verification
Use benchmarks, load tests, traces, CPU/memory profiles, network metrics, and provider latency dashboards.