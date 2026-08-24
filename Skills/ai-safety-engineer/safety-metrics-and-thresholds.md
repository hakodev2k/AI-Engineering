# Safety Metrics and Thresholds

## Purpose
Define safety measurements that support reliable engineering and release decisions rather than vanity reporting.

## When to use
Use when designing evaluations, dashboards, SLO-like safety objectives, or release gates.

## Inputs
Hazards, user population, event taxonomy, eval data, historical baselines, business constraints.

## Context to inspect
Base rates, severity distribution, sampling, confidence intervals, missing data, and metric incentives.

## Core knowledge
Aggregate rates can hide severe rare failures and subgroup regressions. Metrics need denominators, severity, uncertainty, and clear decision semantics.

## Procedure
1. Start from hazards and desired safety properties.
2. Define events and denominators precisely.
3. Separate severity classes.
4. Add slice metrics for risk-relevant populations and contexts.
5. Estimate uncertainty and minimum sample needs.
6. Establish baselines and thresholds before candidate evaluation.
7. Pair safety metrics with utility metrics.
8. Define actions triggered by threshold breaches.
9. Audit metrics for gaming and blind spots.

## Decision points
Use zero-tolerance metrics for deterministic boundary violations; statistical thresholds for stochastic behavior.

## Common failure patterns
Percentages without denominators; averages masking catastrophic cases; thresholds chosen after results; proxy metrics disconnected from harm.

## Verification
Validate metric calculations on labeled examples and demonstrate that known unsafe systems breach intended thresholds.

## Expected output
A metric specification with formulas, slices, thresholds, uncertainty, and response actions.

## Stop conditions
Stop decision-making when metrics cannot distinguish materially safe from unsafe behavior.