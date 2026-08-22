# Performance Test Automation

## Purpose
Automate repeatable performance checks so material regressions are detected early without turning noisy benchmarks into unreliable CI gates.

## When to use
Use for stable critical paths, known regression-prone components, libraries, APIs, and release qualification.

## Inputs
Benchmark/load scripts, baseline distributions, CI environment, target metrics, historical variance, artifacts, and release process.

## Context to inspect
Inspect runner variability, shared infrastructure, build modes, test data, environment provisioning, warmup, dependency stability, and result retention.

## Core knowledge
Performance tests are statistical and environment-sensitive. Hard gates require controlled environments and thresholds larger than normal noise. Trend detection can be safer than failing every small deviation.

## Procedure
1. Select high-value scenarios with stable measurement boundaries.
2. Make environment and test data reproducible.
3. Define warmup, repetitions, and sampling rules.
4. Establish historical variance and baseline ranges.
5. Store raw results and environment metadata.
6. Define regression thresholds using practical effect size and noise.
7. Run quick checks in CI and heavier tests in dedicated stages when appropriate.
8. Re-run suspected regressions before blocking release.
9. Publish trends by version and scenario.
10. Periodically recalibrate baselines after intentional improvements or platform changes.

## Decision points
Use microbenchmark gates for deterministic hot code; dedicated load-test environments for system behavior; trend alerts when infrastructure noise prevents reliable binary gates.

## Common failure patterns
Shared noisy runners, one-sample gates, silently moving baselines, debug builds, unstable external dependencies, and thresholds smaller than natural variance.

## Verification
Known injected regressions are detected reliably while unchanged builds remain within an acceptable false-positive rate.

## Expected output
A reproducible automated performance test suite with evidence retention and defensible thresholds.

## Stop conditions
Do not enforce release-blocking gates until environment variance and false-positive behavior are understood.