# Benchmark Design and Reproducibility

## Purpose
Design benchmarks that produce comparable, statistically defensible optimization evidence.

## When to use
For any performance claim, regression gate, runtime/hardware comparison, or optimization experiment.

## Inputs
Optimization question, workloads, metrics, environment, model/data versions, candidate configurations.

## Preconditions
Define the hypothesis and controlled variables before running experiments.

## Context to inspect
Inspect warmup, caches, clocks/power, background load, synchronization, input distributions, random seeds, compiler state, and telemetry overhead.

## Core knowledge
Benchmarks answer specific questions. Variance, warmup, asynchronous execution, selection bias, and environment drift can create false wins.

## Procedure
1. State hypothesis and primary metric.
2. Define representative datasets/shapes.
3. Pin software, model, hardware, and settings.
4. Specify warmup and cache state.
5. Synchronize asynchronous work before timing.
6. Run enough repetitions to characterize variance.
7. Capture latency distributions, not only means.
8. Randomize/interleave candidates when drift is possible.
9. Store raw results and metadata.
10. Reproduce the winning result from a clean run.

## Decision points
Use microbenchmarks for isolated mechanisms and end-to-end benchmarks for user impact. Prefer paired comparisons when input variability is high.

## Common failure patterns
Cherry-picking best runs, hidden warm caches, different input lengths, no variance, unsynchronized GPU timing, and comparing unlike quality levels.

## Verification
A clean rerun by another operator or environment reproduces direction and magnitude within stated tolerance.

## Expected output
Benchmark specification, raw/summary results, environment manifest, statistical interpretation, and conclusion.

## Stop conditions
Stop when uncontrolled environmental drift or workload mismatch makes comparison invalid.