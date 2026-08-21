# Performance Regression Analysis

## Purpose
Determine whether a software, configuration, dependency, or infrastructure change caused a measurable performance regression and isolate the responsible change.

## When to use
Use after latency, throughput, CPU, memory, or cost worsens across releases or configuration changes.

## Inputs
Before/after telemetry, deployment history, benchmark results, code/config diffs, environment metadata, workload distributions, and dependency versions.

## Context to inspect
Inspect traffic mix, data growth, infrastructure shape, runtime/library upgrades, feature flags, query plans, cache behavior, and observability changes.

## Core knowledge
A temporal correlation can be confounded by workload or environment drift. Compare normalized metrics such as CPU per request and segment by workload. Bisect changes when reproducible.

## Procedure
1. Define the regressed metric and first known bad interval/version.
2. Confirm the workload and environment are comparable.
3. Normalize resource metrics by useful work where possible.
4. Compare distributions, not only aggregate averages.
5. Correlate regression onset with deployments and configuration changes.
6. Segment by endpoint, tenant, payload, region, and dependency.
7. Reproduce in a controlled environment.
8. Bisect candidate changes when practical.
9. Profile or trace the before/after versions.
10. Fix or revert the causal change and rerun the same benchmark.
11. Add a regression guard for the metric.

## Decision points
Use rollback for urgent impact; use bisect for reproducible multi-change windows; investigate workload drift first when no deployment aligns with onset.

## Common failure patterns
Comparing different traffic populations, blaming the latest deployment automatically, ignoring data growth, benchmark environment drift, and accepting noisy single-run differences.

## Verification
The identified change reproduces the regression and its removal/remediation restores the metric under equivalent conditions.

## Expected output
A causal regression report with before/after evidence and a prevention guard.

## Stop conditions
Stop when historical telemetry or reproducible versions are insufficient to distinguish competing causes.