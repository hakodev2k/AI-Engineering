# Fairness and Bias Evaluation

## Purpose
Identify and mitigate materially unequal model behavior across relevant populations and contexts.

## When to use
For models affecting people, access, ranking, risk, moderation, pricing, or other consequential decisions.

## Inputs
Use case, population definitions, labels, predictions, protected/sensitive attributes where lawful, policy constraints, harm analysis.

## Context to inspect
Representation, label bias, historical decisions, subgroup sample sizes, threshold policy, downstream interventions.

## Core knowledge
Fairness is context-specific; metrics can conflict. Statistical parity is not universally appropriate. Evaluate harms and decision pathways, not only model outputs.

## Procedure
1. Identify affected groups and plausible harms.
2. Confirm lawful/ethical handling of sensitive attributes.
3. Measure representation and label quality by group.
4. Evaluate primary metrics, error rates, calibration, and uncertainty by group.
5. Inspect intersectional and low-sample cohorts carefully.
6. Trace disparities to data, objective, features, thresholds, or workflow.
7. Compare mitigation options and utility trade-offs.
8. Document residual risk and monitoring.

## Decision points
Choose mitigation based on harm mechanism: data improvements, objective changes, threshold policy, human review, or product redesign.

## Common failure patterns
Selecting a fairness metric without context, hiding small-sample uncertainty, treating sensitive attributes as ordinary features, and assuming removing them removes bias.

## Verification
Reported disparities include confidence/sample context and selected mitigation improves agreed harm measures without hidden unacceptable regressions.

## Expected output
A fairness assessment, mitigation rationale, and monitoring plan.

## Stop conditions
Escalate consequential unresolved disparities or unclear legal/policy requirements.