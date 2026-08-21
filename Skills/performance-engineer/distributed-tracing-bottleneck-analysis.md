# Distributed Tracing Bottleneck Analysis

## Purpose
Use traces to locate critical-path latency, fan-out amplification, retries, queue delays, and cross-service bottlenecks in distributed systems.

## When to use
Use when latency spans multiple services or dependencies and local profiling cannot explain end-to-end behavior.

## Inputs
Distributed traces, service maps, request identifiers, latency/error metrics, sampling configuration, deployment metadata, and workload segments.

## Context to inspect
Inspect span hierarchy, missing spans, async boundaries, retries, parallel branches, queue time, dependency calls, region hops, and sampling bias.

## Core knowledge
The critical path, not the sum of all span durations, determines request latency when work is parallel. Trace instrumentation can be incomplete, and sampling may underrepresent rare slow requests.

## Procedure
1. Select slow and representative trace populations.
2. Confirm clock and instrumentation quality.
3. Identify the end-to-end critical path.
4. Separate service processing, waiting, and dependency time.
5. Detect serial fan-out that could be parallel or eliminated.
6. Identify retry and timeout amplification.
7. Correlate slow spans with resource and deployment metrics.
8. Segment by endpoint, tenant, payload, region, and version.
9. Form and test the highest-impact bottleneck hypothesis.
10. Compare trace distributions after remediation.

## Decision points
Add instrumentation when missing spans block causal analysis, but avoid high-cardinality or sensitive attributes. Parallelize only when dependencies and consistency allow it.

## Common failure patterns
Summing parallel spans, blaming the longest individual span without critical-path analysis, ignoring queue time, using one trace as proof, and overlooking sampling bias.

## Verification
A statistically meaningful trace population should show the targeted critical-path reduction and corresponding SLO improvement.

## Expected output
A cross-service latency decomposition with evidence-backed remediation.

## Stop conditions
Stop when trace data is too incomplete or sensitive-data handling prevents safe analysis.