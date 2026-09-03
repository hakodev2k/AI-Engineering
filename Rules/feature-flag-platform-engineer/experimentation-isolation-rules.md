# Experimentation Isolation Rules

## Purpose
Keep experimentation concerns from corrupting release safety, authorization, or product behavior.

## Scope
Applies to A/B tests, multivariate tests, holdouts, experiment variants, and experiment-specific targeting.

## MUST
- Experiment flags MUST distinguish treatment assignment from authorization and entitlement decisions.
- Variant assignment MUST be stable for the experiment unit unless the experiment design explicitly requires re-randomization.
- Experiment exposure MUST be recorded only when the subject can actually observe the treatment.
- Experiment changes MUST preserve analytical interpretability or explicitly reset the experiment.
- Concurrent experiments with interacting treatments MUST be reviewed for interference risk.

## MUST NOT
- MUST NOT use an experiment flag as a substitute for an access-control decision.
- MUST NOT silently change experiment population, bucketing unit, or variant meaning after analysis begins.
- MUST NOT count evaluation alone as exposure when the treatment is not delivered.

## SHOULD
- Experiment metadata SHOULD identify hypothesis, owner, population, primary metric, and planned end condition.

## Exceptions
Exploratory experiments may use simplified metadata when analytical consequences are explicitly accepted.

## Verification
Inspect assignment logic, exposure instrumentation, experiment definitions, cohort stability, and interaction analysis.