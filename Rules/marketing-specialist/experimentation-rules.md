# Experimentation Rules

## Purpose
Ensure marketing experiments produce interpretable evidence without avoidable customer or business risk.

## Scope
Applies to A/B tests, holdouts, creative tests, offer tests, channel tests, and conversion experiments.

## MUST
- Experiments MUST state hypothesis, primary metric, guardrails, audience, duration logic, and decision rule before launch.
- Material tests MUST avoid overlapping changes that make attribution of effect ambiguous unless intentionally factorial.
- Sample size and stopping logic MUST be appropriate to the decision risk.
- Experiment results MUST include negative and null outcomes, not only wins.

## MUST NOT
- MUST NOT stop tests early solely because interim results look favorable.
- MUST NOT redefine the primary metric after observing results without labeling the analysis exploratory.
- MUST NOT expose customers to deceptive, unsafe, or prohibited treatments for experimentation.

## SHOULD
- Experiments SHOULD use holdouts or randomization where feasible.
- Learnings SHOULD be documented for reuse.

## Exceptions
Exceptions require rationale, methodological limitations, risk assessment, and owner approval.

## Verification
Review experiment plans, assignment logic, sample sizes, metric definitions, stopping records, and result analyses.