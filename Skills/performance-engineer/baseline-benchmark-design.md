# Baseline and Benchmark Design

## Purpose
Create controlled benchmarks that establish trustworthy baselines and quantify whether a change improves the intended performance metric.

## When to use
Use before optimization, framework upgrades, algorithm changes, infrastructure changes, or competing implementation decisions.

## Inputs
Candidate implementations, workload model, target metrics, environment configuration, test data, build artifacts, and known sources of variance.

## Context to inspect
Inspect compiler/runtime mode, hardware, container limits, database state, caches, JIT/warmup behavior, network placement, test isolation, and telemetry overhead.

## Core knowledge
A benchmark is an experiment. Control variables, warm up appropriately, collect distributions rather than one timing, repeat runs, and separate measurement noise from meaningful effects.

## Procedure
1. State the hypothesis and metric being tested.
2. Select a representative workload and dataset.
3. Fix software, hardware, and configuration variables not under test.
4. Define warmup and steady-state criteria.
5. Establish the unmodified baseline.
6. Run multiple samples and capture distributions.
7. Change one primary variable at a time when possible.
8. Record CPU, memory, I/O, network, and dependency metrics alongside latency.
9. Compare confidence, variance, and practical effect size.
10. Repeat suspicious or noisy results.
11. Preserve scripts, configuration, versions, and raw evidence.

## Decision points
Use microbenchmarks for isolated code paths and system benchmarks for end-to-end behavior. Do not extrapolate microbenchmark gains directly to production impact.

## Common failure patterns
Single-run timing, debug builds, changing several variables simultaneously, comparing different datasets, benchmark-specific code paths, and ignoring warmup or thermal/resource throttling.

## Verification
Another engineer should be able to reproduce the baseline and obtain materially similar distributions under the documented environment.

## Expected output
A reproducible benchmark package with baseline, candidate results, variance, interpretation, and limitations.

## Stop conditions
Stop when environments cannot be made comparable or benchmark noise is larger than the claimed improvement.