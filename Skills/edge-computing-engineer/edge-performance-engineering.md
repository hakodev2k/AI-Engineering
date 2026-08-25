# Edge Performance Engineering

## Purpose
Diagnose and improve end-to-end edge performance across compute, storage, network, and device-cloud boundaries without destabilizing constrained nodes.

## When to use
Use for latency regressions, missed control deadlines, slow synchronization, overloaded gateways, or poor throughput.

## Inputs
Latency/throughput targets, profiles, metrics, traces, hardware specs, workload samples, network measurements.

## Context to inspect
Inspect CPU, memory, I/O, storage latency, queues, serialization, network RTT, retries, thermal throttling, and cloud dependency latency.

## Core knowledge
Senior edge optimization starts from end-to-end measurement and resource budgets. Tail latency, queuing, contention, thermal behavior, and intermittent links often dominate averages.

## Procedure
1. Define the exact user or machine-visible performance objective.
2. Reproduce with representative hardware and data.
3. Break total latency into measurable stages.
4. Measure saturation and queueing at each stage.
5. Identify the dominant bottleneck before changing code.
6. Optimize the smallest high-impact component.
7. Protect resource bounds and correctness.
8. Compare before/after distributions, not only averages.
9. Soak-test for thermal and memory effects.
10. Record the benchmark and regression threshold.

## Decision points
Scale hardware when engineering cost exceeds recurring capacity cost; optimize software when fleet scale magnifies per-device inefficiency or hardware cannot change.

## Common failure patterns
Premature optimization, desktop-only benchmarks, ignoring p95/p99, hiding latency with larger queues, disabling durability for speed, missing thermal throttling.

## Verification
Re-run identical workloads and prove target improvement without regressions in resource use, correctness, stability, or power/thermal limits.

## Expected output
A measured bottleneck analysis, implemented improvement, and repeatable benchmark evidence.

## Stop conditions
Stop when required performance exceeds physical hardware or network limits and needs architectural or product trade-offs.