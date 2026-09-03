# Cascade Routing

## Purpose
Design multi-stage inference cascades where inexpensive models handle easy requests and stronger models receive uncertain or difficult cases.

## When to use
Use when workload difficulty varies and a single premium model is too costly or slow for all traffic.

## Inputs
Candidate models, confidence signals, escalation thresholds, evaluation set, cost and latency targets, retry/fallback constraints.

## Context to inspect
Task error distribution, model confidence calibration, response validation, downstream tolerance, provider latency, and user-facing timeout budgets.

## Core knowledge
A cascade succeeds only if escalation signals correlate with error. Uncalibrated self-confidence is insufficient. End-to-end latency accumulates across stages, so escalation must fit the remaining deadline.

## Procedure
1. Establish quality and cost baselines for each model alone.
2. Identify observable uncertainty or validation signals.
3. Calibrate escalation thresholds on held-out data.
4. Define maximum cascade depth and deadline budget.
5. Preserve request context and decision trace across stages.
6. Prevent repeated expensive retries for equivalent failures.
7. Evaluate quality, cost, and p95/p99 latency jointly.
8. Shadow-test the cascade.
9. Roll out by traffic cohort with rollback thresholds.

## Decision points
Use a two-stage cascade unless evidence justifies more stages. Escalate on validation failure, low calibrated confidence, high task complexity, or risk classification—not arbitrary model preference.

## Common failure patterns
Using raw confidence, exceeding latency budgets, duplicate tool actions, cascading deterministic policy failures, and measuring only final quality while ignoring cost amplification.

## Verification
Verify threshold calibration, escalation precision/recall, end-to-end latency, cost per successful request, and no duplicate side effects.

## Expected output
A versioned cascade policy with escalation signals, thresholds, deadline handling, and evaluation evidence.

## Stop conditions
Stop if escalation signals do not predict failure better than chance or if the cascade cannot meet hard latency limits.