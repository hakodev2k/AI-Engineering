# CI Regression and Release Gates

## Purpose
Turn robotics simulation into dependable CI evidence by selecting stable tests, defining quantitative release gates, and preserving artifacts for failure diagnosis.

## When to use
Use when adding simulation to pull-request, nightly, pre-release, or hardware-deployment pipelines.

## Inputs
Requirements, canonical scenarios, baseline metrics, runtime budget, simulator image, artifact storage, flakiness history, release risk policy.

## Preconditions
Candidate scenarios must already be reproducible and have validated pass/fail semantics.

## Context to inspect
Build dependencies, simulator startup, deterministic seeds, GPU runners, test duration, resource contention, retry behavior, metric noise, baseline ownership, and artifact retention.

## Core knowledge
A release gate must distinguish meaningful regression from simulation noise. Fast deterministic tests belong in frequent CI; broad stochastic campaigns usually belong in scheduled qualification. Thresholds should derive from engineering tolerances or statistical evidence, not arbitrary percentages.

## Procedure
1. Trace each gate to a requirement or known risk.
2. Classify tests by runtime, determinism, and diagnostic value.
3. Put fast deterministic invariants in pull-request CI.
4. Put expensive scenario families in nightly or release suites.
5. Define metric thresholds and uncertainty treatment.
6. Pin simulator, assets, seeds, and runtime environment.
7. Capture logs, traces, scenario metadata, screenshots/recordings only when diagnostically useful.
8. Define bounded retry policy for infrastructure failures, not behavioral failures.
9. Establish baseline update ownership and review rules.
10. Measure false-positive and escaped-regression rates.
11. Periodically retire redundant tests and add field-derived regressions.

## Decision points
Block merges only on high-confidence, high-value tests. Quarantine flaky tests temporarily with explicit ownership rather than normalizing retries. Use statistical gates for stochastic metrics and exact invariants for deterministic safety properties.

## Common failure patterns
One giant suite on every commit; arbitrary retry-until-green; baseline updates without review; infrastructure failures reported as robot failures; missing artifacts; thresholds wider than meaningful regressions.

## Verification
Intentionally introduce representative regressions and confirm gates detect them, then repeat unchanged builds to quantify false failures. Verify artifacts reproduce failed scenarios.

## Expected output
A tiered simulation CI strategy with traceable gates, thresholds, retry policy, artifacts, ownership, and measured stability.

## Stop conditions
Stop gating releases when test instability exceeds the declared confidence, infrastructure cannot reproduce the environment, or pass criteria are disputed and require responsible engineering approval.