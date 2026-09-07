# GPU Performance Regression Testing in CI

## Purpose
Detect meaningful GPU performance regressions before release using stable benchmarks, controlled thresholds, architecture-aware baselines, and triage procedures that distinguish real slowdowns from environmental noise.

## When to use
Use when kernel performance is production-critical, compiler/runtime upgrades can alter code generation, or optimization work needs durable regression protection.

## Inputs
Benchmark suite, supported GPU matrix, historical baselines, CI hardware characteristics, correctness tests, compiler/runtime versions, acceptable regression budgets.

## Preconditions
Benchmarks must be statistically stable enough for automation. CI runners used for gating should be dedicated or characterized sufficiently to define trustworthy thresholds.

## Context to inspect
Inspect benchmark variance, runner sharing, thermal/power policy, driver and compiler drift, architecture differences, warm-up, clock behavior, workload shape coverage, and whether a metric is kernel-local or end-to-end.

## Core knowledge
Performance gates need noise-aware thresholds. A universal percentage threshold is rarely appropriate across all benchmarks. Baselines must be versioned with environment metadata, and regression triage should inspect both runtime and supporting counters when available.

## Procedure
1. Select a small set of high-value representative benchmarks.
2. Establish repeated baseline distributions per supported architecture.
3. Define warning and blocking thresholds above observed noise.
4. Pin or record driver, compiler, runtime, clocks/power policy, and GPU identity.
5. Warm and measure each case using identical timing semantics.
6. Compare changes using robust statistics rather than single samples.
7. On a suspected regression, rerun the candidate and baseline in alternating order.
8. Capture profiler/resource deltas for persistent regressions.
9. Require an explicit baseline update with rationale for intentional changes.
10. Periodically audit benchmark relevance against production workloads.

## Decision points
Gate only on benchmarks stable enough to avoid chronic false positives. Use separate baselines per architecture when code generation or hardware behavior differs. Treat small unstable changes as investigation signals rather than hard failures.

## Common failure patterns
Running gates on noisy shared hardware; silently moving baselines; comparing different compiler environments; overfitting to one tensor shape; blocking on sub-noise differences; ignoring correctness when chasing performance.

## Verification
Induce a known slowdown and confirm CI detects it; confirm unchanged commits remain within thresholds across repeated runs; verify baseline metadata is sufficient to reproduce results.

## Expected output
A versioned GPU performance gate with representative cases, noise-calibrated thresholds, and a documented triage workflow.

## Stop conditions
Escalate when CI hardware cannot provide stable measurements, baseline drift cannot be controlled, or product performance requirements are not defined well enough to choose meaningful gates.