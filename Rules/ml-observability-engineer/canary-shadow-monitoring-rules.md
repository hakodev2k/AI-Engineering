# Canary and Shadow Monitoring

## Purpose
Require evidence from controlled exposure before broad model or inference changes are trusted in production.

## Scope
Applies to canary releases, shadow inference, champion-challenger evaluation, traffic splitting, and staged model rollout.

## MUST
- Canary or shadow comparisons MUST define success metrics, guardrails, cohorts, minimum evidence, and stop conditions before exposure begins.
- Compared populations MUST be made sufficiently comparable for the decision being made, or known biases MUST be documented.
- Safety, latency, error, and model-quality regressions MUST be evaluated separately when all are material.
- Promotion decisions MUST preserve the evidence used and identify the evaluated artifact versions.

## MUST NOT
- MUST NOT promote solely because no infrastructure alert fired.
- MUST NOT continue a canary after a predefined critical abort condition is met without explicit human approval.
- MUST NOT treat shadow results as equivalent to live user outcomes when product feedback loops differ.

## SHOULD
- Increase exposure progressively as evidence accumulates.
- Use automated comparison reports for repeatable promotion gates.

## Exceptions
Skipping staged observation requires documented urgency, risk, compensating verification, rollback readiness, and accountable approval.

## Verification
Review rollout configuration, cohort assignment, guardrail definitions, comparison reports, abort behavior, and promotion records.