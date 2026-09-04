# Performance Investigation

## Purpose
Diagnose ML compiler performance regressions systematically across graph capture, optimization, code generation, runtime, kernels, and hardware behavior.

## When to use
Use when compiled execution is slower than eager/reference execution, a compiler change regresses latency or throughput, or hardware utilization is unexpectedly low.

## Inputs
Reproducer, compiler revision, baseline revision, profiles, IR dumps, generated code, hardware counters, benchmark methodology.

## Context to inspect
Inspect compile time separately from runtime, graph breaks, fusion, kernel count, data movement, launch overhead, occupancy, memory bandwidth, instruction mix, synchronization, and cache behavior.

## Core knowledge
Performance must be decomposed before optimization. End-to-end slowdowns can originate from compile overhead, graph partitioning, poor lowering, runtime synchronization, kernel code quality, or workload variance. Measure before changing code.

## Procedure
1. Establish a stable benchmark with warm-up, repetitions, and variance reporting.
2. Confirm the regression against a known-good baseline.
3. Separate compilation latency from execution latency.
4. Compare graph structure, partitions, and kernel counts.
5. Diff important IR stages and generated code.
6. Profile CPU/GPU/device timelines for idle gaps and synchronization.
7. Use hardware counters to classify compute, memory, occupancy, or launch bottlenecks.
8. Bisect compiler changes when scope is unclear.
9. Form one falsifiable hypothesis at a time.
10. Implement the smallest correction or optimization.
11. Rebenchmark representative models and shapes to detect trade-offs.
12. Add a performance regression test when stable enough.

## Decision points
Optimize compiler time when workloads compile frequently or shapes churn; prioritize runtime when artifacts are reused. Prefer global graph improvements over micro-kernel tuning when launches/copies dominate.

## Common failure patterns
Benchmarking without synchronization, optimizing microbenchmarks while regressing end-to-end workloads, ignoring variance, changing multiple variables at once, and attributing regressions to codegen without timeline evidence.

## Verification
Reproduce the original regression, demonstrate statistically credible recovery or improvement, confirm correctness, and test adjacent representative workloads for regressions.

## Expected output
A root-cause report or fix backed by benchmark data, profile evidence, affected compiler stage, and regression protection.

## Stop conditions
Stop if benchmark variance obscures the claimed effect, hardware/profile access is insufficient to distinguish causes, or a proposed fix trades correctness for speed without explicit approval.