# GPU Benchmarking and Performance Regression

## Purpose
Create trustworthy GPU benchmarks and regression gates that distinguish real performance changes from noise.

## When to use
Use for optimization validation, CI performance gates, hardware comparisons, library upgrades, or release qualification.

## Inputs
Target metrics, representative workloads, hardware/software inventory, baseline distributions, correctness checks, CI environment.

## Preconditions
Define workload representativeness and acceptable variance before setting thresholds.

## Context to inspect
Inspect warm-up, asynchronous timing, clocks, thermal state, power limits, background load, compilation/autotuning, cache state, input distributions, and synchronization boundaries.

## Core knowledge
GPU timing requires explicit completion boundaries or device events. Cold-start and steady-state are different metrics. Dynamic clocks and shared resources create variance. Statistical distributions are more useful than single measurements.

## Procedure
1. Define the metric and user impact.
2. Select representative shapes and scenarios.
3. Separate startup, warm-up, and steady state.
4. Synchronize timing boundaries correctly.
5. Record hardware, driver, runtime, library, clocks, and power configuration.
6. Run enough repetitions to estimate variance.
7. Store baseline distributions and correctness evidence.
8. Compare changes using effect size and noise-aware thresholds.
9. Investigate regressions before automatically relaxing gates.
10. Periodically validate benchmark representativeness.

## Decision points
Use microbenchmarks for component regressions and end-to-end tests for user impact. Gate only stable metrics. Pin environments more tightly when small regressions matter.

## Common failure patterns
Timing asynchronous launches from the host, no warm-up, comparing different GPU states, cherry-picking best runs, unstable shared CI hosts, missing correctness checks, and thresholds below natural variance.

## Verification
Verify benchmark repeatability, correct timing semantics, environment metadata, representative coverage, and that injected slowdowns trigger the regression gate.

## Expected output
A reproducible benchmark suite, baseline distributions, regression policy, and actionable failure diagnostics.

## Stop conditions
Stop when environment variance overwhelms the target effect, representative workloads are unavailable, or benchmark correctness cannot be established.