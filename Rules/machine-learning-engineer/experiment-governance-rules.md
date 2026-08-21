# Experiment Governance Rules
## Purpose
Make experimentation comparable, auditable, and decision-oriented.
## Scope
Model, feature, hyperparameter, and algorithm experiments.
## MUST
- State hypothesis, baseline, changed variables, evaluation protocol, and decision criterion for consequential experiments.
- Track parameters, metrics, code revision, data identity, and artifacts for candidates considered for promotion.
- Distinguish exploratory findings from validated conclusions.
## MUST NOT
- Cherry-pick successful runs while hiding relevant failed or contradictory evidence.
- Compare candidates evaluated on materially different data without disclosure.
## SHOULD
- Change one major causal factor at a time when practical.
## Exceptions
Broad searches may vary many factors but require systematic tracking and unbiased final evaluation.
## Verification
Inspect experiment records, comparison tables, provenance, and holdout evaluation.