# Problem Framing

## Purpose
Translate an ambiguous business question into a measurable data-science problem with explicit decisions, outcomes, constraints, and success criteria.

## When to use
Use before analysis, experimentation, prediction, ranking, forecasting, or optimization work. Do not begin modeling while the target decision remains unclear.

## Inputs
Business objective, stakeholders, candidate data, operational constraints, current baseline, costs of errors, and delivery context.

## Context to inspect
Existing workflows, decision owners, historical metrics, data-generating process, intervention points, latency needs, and downstream consumers.

## Core knowledge
A technically accurate model can be useless when its output cannot change a decision. Separate business outcome, statistical estimand, prediction target, evaluation metric, and operational action. Identify causal questions versus predictive questions early.

## Procedure
1. State the decision or action the work should improve.
2. Identify users, affected populations, and decision frequency.
3. Define the observable outcome and prediction or inference horizon.
4. Establish the current baseline and acceptable improvement.
5. Quantify asymmetric error costs and operational constraints.
6. Determine whether the problem is descriptive, predictive, causal, or optimization-oriented.
7. Check whether required labels and features exist at decision time.
8. Define offline, online, and business success metrics.
9. Record assumptions, exclusions, risks, and non-goals.
10. Produce a falsifiable problem statement before implementation.

## Decision points
Prefer a simple analytical answer when modeling adds no decision value. Use causal methods when the question concerns intervention effects; prediction alone cannot establish them.

## Common failure patterns
Optimizing a proxy detached from business value, target leakage, undefined baseline, ignoring error asymmetry, confusing correlation with intervention impact, and accepting a solution that cannot be operationalized.

## Verification
Confirm stakeholders agree on the decision, target, horizon, baseline, metrics, constraints, and what evidence would make the project unsuccessful.

## Expected output
A concise problem specification linking business outcome to measurable technical objectives and operational decisions.

## Stop conditions
Stop when the decision owner, measurable outcome, feasible data, or acceptable risk cannot be established.