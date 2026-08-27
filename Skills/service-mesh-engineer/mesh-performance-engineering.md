# Mesh Performance Engineering

## Purpose
Quantify and reduce service-mesh latency, CPU, memory and network overhead without weakening required controls.

## When to use
Use for SLO regressions, capacity planning, proxy tuning or mesh adoption benchmarks.

## Inputs
Baseline latency, throughput, payload sizes, protocols, proxy resources and representative workloads.

## Context to inspect
Application profiles, proxy stats, CPU throttling, connection pools, TLS, filters, telemetry and kernel/network metrics.

## Core knowledge
Mesh overhead is workload-dependent. Tail latency often reflects queueing, CPU throttling, connection churn or filter work rather than median proxy processing time.

## Procedure
1. Establish application-only and meshed baselines.
2. Reproduce with representative concurrency and payloads.
3. Separate network, application and proxy time using traces/profiles.
4. Check CPU throttling, memory pressure and connection churn.
5. Measure cost of TLS, logging, tracing and filters.
6. Tune one variable at a time.
7. Re-run statistically meaningful benchmarks.
8. Test under saturation and failure.
9. Convert findings into resource requests/limits and guardrails.

## Decision points
Scale proxy resources when contention is proven; reduce telemetry/filter work when its value does not justify cost. Avoid bypassing security solely for benchmark gains.

## Common failure patterns
Microbenchmarks with unrealistic traffic, optimizing averages instead of tails, ignoring throttling, changing many knobs at once and comparing different application builds.

## Verification
Produce repeatable before/after measurements with confidence ranges and no SLO/security regression.

## Expected output
A bottleneck diagnosis and evidence-backed tuning recommendation.

## Stop conditions
Stop if production-only testing is required without safeguards or measurements cannot isolate the proxy contribution.