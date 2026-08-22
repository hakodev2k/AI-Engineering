# Load Testing

## Purpose
Validate latency, throughput, stability, and resource behavior under expected and peak production workloads.

## When to use
Use before high-risk releases, capacity changes, traffic events, architecture changes, and when validating performance SLOs.

## Inputs
Workload model, environment topology, performance targets, test data, monitoring access, dependency limits, and rollback or abort criteria.

## Preconditions
Use an authorized environment and ensure the test cannot unintentionally overload shared or production systems.

## Context to inspect
Inspect autoscaling, rate limits, caches, database capacity, connection pools, queues, downstream quotas, test-data lifecycle, and observability coverage.

## Core knowledge
Load tests should control arrival rate and model realistic traffic. Throughput can plateau while latency grows due to queueing. Client-side generator saturation can masquerade as server behavior.

## Procedure
1. Define pass/fail targets and abort thresholds.
2. Validate workload realism and test-data safety.
3. Verify the load generator has sufficient capacity.
4. Run a low-load smoke test.
5. Ramp gradually to normal load and hold to steady state.
6. Ramp to expected peak and hold long enough to expose contention.
7. Capture latency percentiles, errors, throughput, saturation, queues, and resource metrics.
8. Correlate client and server timestamps.
9. Inspect downstream systems for hidden bottlenecks.
10. Repeat after remediation using the same model.
11. Store scripts, raw results, environment details, and conclusions.

## Decision points
Use step loads for capacity curves, realistic ramps for operational validation, and constant-arrival-rate models when queueing behavior matters.

## Common failure patterns
Unbounded tests, generator bottlenecks, unrealistic cache hits, short test duration, no server telemetry, counting failed requests as throughput, and testing against materially smaller data.

## Verification
Targets must be met during the defined steady-state window without unacceptable errors, backlog growth, or resource saturation.

## Expected output
A load-test report with reproducible evidence, bottlenecks, headroom, and recommendations.

## Stop conditions
Abort when safety thresholds are crossed, shared dependencies are endangered, or telemetry is insufficient to interpret results.