# Decision Threshold Optimization

## Purpose
Convert model scores into operational decisions using explicit costs, benefits, constraints, and uncertainty.

## When to use
Use when a predictive score triggers review, intervention, approval, rejection, prioritization, or allocation.

## Inputs
Scores, labels, calibrated probabilities if available, action costs, outcome values, capacity, and risk constraints.

## Context to inspect
Prevalence, calibration, subgroup behavior, intervention capacity, downstream workflow, and policy constraints.

## Core knowledge
The model and decision policy are separate. The optimal threshold depends on utility, prevalence, capacity, and calibration, and may change over time. A default 0.5 threshold is rarely justified.

## Procedure
1. Define actions available at each score range.
2. Quantify false-positive, false-negative, and intervention costs.
3. Validate score calibration where probabilities are used.
4. Build threshold curves for precision, recall, workload, and expected utility.
5. Evaluate candidate thresholds on untouched validation data.
6. Check subgroup consequences and guardrails.
7. Stress test prevalence and capacity changes.
8. Choose a policy with explicit rationale.
9. Define monitoring and re-optimization triggers.

## Decision points
Use a capacity-based top-K policy when resources are fixed; use utility thresholds when costs are estimable; use abstention or human review when uncertainty is high.

## Common failure patterns
Using 0.5 by habit, tuning thresholds on test data, ignoring calibration, optimizing one metric without workload, and silently applying different thresholds to groups without governance.

## Verification
Replay the policy on representative historical data and verify expected volumes, utility, and guardrails.

## Expected output
A documented score-to-action policy with measured operational consequences.

## Stop conditions
Stop when action costs, capacity, or governance constraints are unknown enough to make threshold selection arbitrary.