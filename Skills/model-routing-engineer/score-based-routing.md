# Score-Based Routing

## Purpose
Route requests by computing comparable utility scores across eligible models using measurable quality, latency, cost, and reliability signals.

## When to use
Use when deterministic eligibility rules are insufficient and several acceptable models differ materially by workload.

## Inputs
Eligible models, normalized metrics, workload features, objective weights, evaluation data, operational constraints.

## Context to inspect
Current policies, metric distributions, model-specific failure modes, traffic segments, tail latency, and cost accounting.

## Core knowledge
Scores are only meaningful when features are calibrated to comparable scales and hard constraints remain outside the score. Weighted sums can hide unacceptable regressions, so enforce guardrails first.

## Procedure
1. Filter ineligible candidates using hard policy rules.
2. Select routing features observable before inference.
3. Normalize quality, cost, latency, and reliability metrics.
4. Define the utility function and weights by traffic segment.
5. Add penalties for uncertainty or stale measurements.
6. Simulate decisions on historical traffic.
7. Inspect sensitivity to weight changes.
8. Add deterministic tie-breakers.
9. Shadow the scorer in production.
10. Roll out gradually with guardrails.

## Decision points
Use segment-specific weights when business value differs by task. Prefer constrained optimization over a single score if an objective has a strict threshold.

## Common failure patterns
Uncalibrated features, double-counting correlated metrics, optimizing averages, using post-response features, and silently changing weights without versioning.

## Verification
Verify replay results, metric calibration, stable tie-breaking, guardrail compliance, and online outcomes against the baseline.

## Expected output
A versioned scoring policy with feature definitions, normalization, weights, simulation evidence, and rollback criteria.

## Stop conditions
Stop when objective weights cannot be justified or historical evaluation data is too weak to distinguish candidates.