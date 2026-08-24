# AI Infrastructure Benchmarking

## Purpose
Build trustworthy benchmarks for accelerator infrastructure so hardware, runtime, topology, and configuration decisions are based on representative evidence.

## When to use
Use for hardware selection, platform changes, capacity planning, performance regressions, or vendor comparisons.

## Inputs
Representative models and datasets, candidate hardware, runtime versions, topology, SLOs, cost data.

## Context to inspect
Warmup behavior, precision, batch size, concurrency, communication pattern, storage path, compilation caches, thermal state, and benchmark repeatability.

## Core knowledge
Microbenchmarks isolate components; application benchmarks reveal end-to-end outcomes. Both are needed. Results are invalid when workload shape, warmup, software stack, or measurement window differs materially.

## Procedure
1. Define the decision the benchmark must support.
2. Choose representative workload classes and success metrics.
3. Pin software, model, precision, dataset, and runtime settings.
4. Record hardware topology and environment.
5. Run warmup before steady-state measurement.
6. Capture latency distributions, throughput, utilization, memory, power, and errors.
7. Repeat runs and quantify variance.
8. Separate compute, communication, and I/O tests where useful.
9. Normalize results by cost when comparing options.
10. Store results with full provenance.

## Decision points
Use microbenchmarks to localize bottlenecks; end-to-end benchmarks for purchasing and production configuration decisions.

## Common failure patterns
Single-run conclusions, mismatched precision, hidden cache effects, comparing different batch sizes, and quoting peak vendor numbers as workload performance.

## Verification
Reproduce benchmark results independently within an agreed variance band.

## Expected output
A reproducible benchmark suite and evidence-backed comparison.

## Stop conditions
Stop when test conditions cannot be made comparable or representative.