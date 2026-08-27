# Load Testing and Benchmarking

## Purpose
Produce trustworthy evidence about load-balancer throughput, latency, fairness, and failure behavior.

## When to use
Use before major changes, capacity increases, algorithm changes, or when diagnosing saturation.

## Inputs
Traffic profile, SLOs, topology, test environment, request mix, payloads, connection model, and expected failures.

## Context to inspect
Inspect production distributions, test-generator limits, backend capacity, observability, warmup behavior, and network path differences.

## Core knowledge
A load test is valid only if the generator, network, and backends do not unintentionally become the bottleneck. Open-loop tests expose queueing differently from closed-loop tests. Tail latency and errors matter more than averages.

## Procedure
1. Define hypotheses and pass/fail criteria.
2. Reproduce request mix, payload, connection, and protocol distributions.
3. Validate generator capacity independently.
4. Warm caches and connections deliberately or test cold start explicitly.
5. Ramp load to locate knee and saturation points.
6. Record p50/p95/p99 latency, errors, throughput, connections, CPU, memory, and network.
7. Inject backend loss and recovery.
8. Compare algorithms or configurations under identical conditions.
9. Repeat tests for variance.
10. Preserve configuration and results.

## Decision points
Use production replay only with privacy and side-effect controls. Use synthetic workloads when isolation and reproducibility matter; supplement them with production-shaped distributions.

## Common failure patterns
Generator saturation; averages hiding tails; unrealistic keepalive; no warmup; changing multiple variables; test environment unlike production.

## Verification
Confirm generator headroom, reproducible results, complete telemetry, and statistically meaningful differences.

## Expected output
A benchmark report with configuration, workload, evidence, bottleneck, and recommendation.

## Stop conditions
Stop if the test can affect production data, generator saturation invalidates results, or required telemetry is absent.