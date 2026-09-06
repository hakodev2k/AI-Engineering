# Online Quality Monitoring

## Purpose
Detect post-release degradation in AI behavior using production-safe signals that complement offline evaluations.

## When to use
Use after canary or production promotion, especially where input distribution changes over time.

## Inputs
Quality objectives, production telemetry, user feedback, sampled outputs where authorized, baseline distributions, and release versions.

## Preconditions
Signals can be attributed to model/config versions and privacy constraints are defined.

## Context to inspect
Inspect user workflows, feedback biases, automated quality proxies, evaluator drift, traffic composition, and seasonal effects.

## Core knowledge
Online quality is partially observable. Proxy metrics can be gamed or confounded; combine multiple signals and compare like-for-like slices before concluding the model regressed.

## Procedure
1. Define observable proxies for critical user outcomes.
2. Establish baseline ranges and known confounders.
3. Segment by version, task, language, customer class, and other relevant slices.
4. Monitor user feedback, task success, fallback rates, repair loops, and policy outcomes.
5. Add sampled human or model-assisted review where appropriate.
6. Detect statistically and operationally meaningful changes.
7. Investigate whether traffic mix, upstream data, or downstream systems explain the delta.
8. Trigger rollback or deeper evaluation when thresholds are crossed.
9. Feed confirmed failures back into offline suites.

## Decision points
Use leading proxies for fast detection and slower human review for confidence. Roll back immediately for severe failures even before aggregate significance is reached.

## Common failure patterns
Treating thumbs-up rate as unbiased truth, mixing versions, ignoring traffic shifts, overreacting to tiny samples, and failing to convert incidents into regression tests.

## Verification
Backtest monitors on known incidents and controlled releases; confirm alerts identify the correct version and slice.

## Expected output
Version-aware quality dashboards, thresholds, investigation workflow, and feedback loop to evaluation suites.

## Stop conditions
Stop automated conclusions when signals are confounded, sample sizes are inadequate, or monitoring requires unauthorized content access.
