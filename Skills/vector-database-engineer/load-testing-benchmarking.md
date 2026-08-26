# Load Testing and Benchmarking

## Purpose
Benchmark vector systems with reproducible, production-shaped workloads to support architecture, tuning, and capacity decisions.

## When to use
Use before launches, upgrades, scaling, index changes, or performance claims.

## Inputs
Corpus snapshot, query distribution, filters, top-k, concurrency, ingestion rate, SLO, hardware, and quality suite.

## Context to inspect
Inspect warm/cold cache behavior, production traffic distributions, tenant skew, index configuration, payload sizes, network path, and resource metrics.

## Core knowledge
Synthetic uniform queries can radically misrepresent ANN/filter workloads. Benchmark quality and performance together. Tail latency, saturation point, recovery after overload, and concurrent ingestion matter more than best-case single-query speed.

## Procedure
1. Freeze dataset, index, software, and hardware versions.
2. Model query classes, filter selectivity, top-k, payload, and concurrency from production expectations.
3. Warm the system according to realistic operating state; also test cold start separately.
4. Ramp load gradually to identify saturation.
5. Record p50/p95/p99, throughput, errors, queueing, CPU/GPU, RAM, I/O, and network.
6. Run concurrent ingestion/update scenarios.
7. Include skew/hot tenants and failure-degraded capacity.
8. Evaluate retrieval quality for tested configurations.
9. Repeat runs and report variance.
10. Preserve scripts/configuration for regression benchmarking.

## Decision points
Use microbenchmarks for isolating components, end-to-end tests for user SLO decisions. Benchmark managed services from realistic client regions/network paths.

## Common failure patterns
Tiny corpus; average latency only; client generator bottleneck; no warm-up; changing multiple variables; unrealistic filters; ignoring errors; benchmarking without recall; publishing one lucky run.

## Verification
Reproduce results across repeated runs, confirm load generator has headroom, and reconcile observed bottlenecks with system metrics.

## Expected output
A reproducible benchmark package, saturation curve, quality/performance results, and capacity conclusions.

## Stop conditions
Stop if test traffic could affect production, dataset is unrepresentative, or instrumentation cannot distinguish client from server bottlenecks.