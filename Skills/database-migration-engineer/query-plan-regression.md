# Query Plan Regression Analysis

## Purpose
Detect and remediate query performance regressions caused by target optimizer, statistics, indexes, configuration, or engine semantics.

## When to use
Use during target validation and whenever migrated workloads show latency or resource regressions.

## Inputs
Critical SQL, source and target execution plans, runtime statistics, indexes, table statistics, parameter distributions, and wait metrics.

## Core knowledge
Equivalent SQL can produce different plans because cost models, statistics, cardinality estimators, parameterization, and physical operators differ.

## Procedure
1. Identify regressed query fingerprints from telemetry.
2. Capture actual plans and runtime metrics on source and target.
3. Compare cardinality estimates with actual rows.
4. Check statistics freshness and distribution.
5. Review indexes and predicate sargability.
6. Test parameter-sensitive behavior.
7. Isolate optimizer/configuration differences.
8. Prefer query/schema/statistics fixes before brittle hints.
9. Benchmark candidate fixes across representative parameters.
10. Add regression monitoring for critical fingerprints.

## Decision points
Use hints only when stable evidence shows optimizer behavior cannot otherwise be corrected and operational ownership is clear.

## Common failure patterns
Comparing estimated plans only, optimizing one parameter, blindly recreating source indexes, and forcing plans without lifecycle management.

## Verification
Measure improved tail latency and resource consumption across representative parameter sets.

## Expected output
Root-cause evidence, validated remediation, and regression guardrails.

## Stop conditions
Stop speculative tuning when workload evidence does not identify the bottleneck.