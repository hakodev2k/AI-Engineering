# eBPF Overhead Benchmarking

## Purpose
Quantify CPU, latency, throughput, memory, and event-pipeline overhead attributable to eBPF instrumentation.

## When to use
Use before rollout, after program changes, or during suspected observer-effect incidents.

## Inputs
Workload, baseline, programs/hooks, event rates, hardware, SLOs, resource budget.

## Context to inspect
Inspect hook frequency, program instruction paths, maps, buffer sizes, user-space consumer cost, CPU/NUMA topology, and workload variance.

## Core knowledge
Overhead must be measured end-to-end: kernel execution, map contention, event transfer, and consumer processing. Average CPU alone can hide tail-latency damage.

## Procedure
1. Define workload and acceptance thresholds.
2. Stabilize an instrumentation-off baseline.
3. Enable one feature/program group at a time.
4. Measure throughput, p50/p95/p99 latency, CPU, memory, drops, and context effects.
5. Test normal and peak event rates.
6. Repeat runs and report variance.
7. Attribute cost to kernel vs user-space components.
8. Optimize only measured bottlenecks.
9. Add regression thresholds to performance testing.

## Decision points
Sampling is preferred when full fidelity exceeds budget. Kernel aggregation is useful when it materially reduces transfer cost without harming semantics.

## Common failure patterns
No baseline, changing workload between runs, reporting only averages, ignoring consumer CPU, and optimizing microbenchmarks unrelated to production.

## Verification
Independent repeated A/B runs must reproduce the claimed delta within defined variance.

## Expected output
A benchmark report with methodology, confidence, and enforceable overhead budget.

## Stop conditions
Stop rollout when overhead exceeds budget or measurements are too noisy to support a conclusion.