# Quantum Performance Benchmarking

## Purpose
Benchmark quantum software and execution paths using metrics that separate algorithm quality, circuit quality, queueing, sampling cost, compilation overhead, and hardware behavior.

## When to use
Use when comparing algorithms, SDK versions, transpilers, providers, backends, optimization strategies, or architectural changes.

## Inputs
Representative workloads, baseline implementation, backend configuration, metric definitions, shot budget, and experiment environment.

## Context to inspect
Circuit width/depth, two-qubit gates, transpilation time, queue time, execution time, shots, fidelity metrics, calibration state, classical preprocessing, and post-processing.

## Core knowledge
Quantum performance is multidimensional. Wall-clock time can be dominated by queue latency; circuit depth may not correlate directly with fidelity; best-of-run results hide stochastic variability. Benchmarks need workload classes, repeated runs, metadata, and uncertainty.

## Procedure
1. Define the decision the benchmark must support.
2. Select representative workloads rather than one toy circuit.
3. Freeze versions, seeds, backend identity, and compilation settings.
4. Record logical and physical circuit metrics.
5. Separate compile, queue, execution, and classical processing times.
6. Measure result quality with problem-appropriate metrics.
7. Repeat enough trials to estimate variance.
8. Normalize comparisons for shots and accuracy where possible.
9. Compare against a classical baseline when making utility claims.
10. Report distributions and confidence intervals, not only averages or best results.
11. Archive raw benchmark artifacts for later reproduction.

## Decision points
Optimize for the metric tied to the actual goal: fidelity, time-to-solution, cost-to-solution, sample efficiency, or resource footprint. Do not collapse unrelated metrics into a single score without justification.

## Common failure patterns
Comparing different calibration windows, excluding failed jobs, timing only quantum execution while ignoring orchestration, reporting best samples, and benchmarking nonrepresentative circuits.

## Verification
Repeat the benchmark, confirm metadata completeness, validate metric calculations, and reproduce a subset independently.

## Expected output
A reproducible benchmark report with workload definitions, distributions, resource metrics, quality metrics, and trade-off conclusions.

## Stop conditions
Stop when environments are not comparable, sample size is insufficient, or calibration drift makes the comparison misleading.