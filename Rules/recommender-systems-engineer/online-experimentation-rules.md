# Online Experimentation Rules

## Purpose
Ensure recommendation changes are validated with controlled online evidence before broad rollout.

## Scope
Applies to A/B tests, interleaving, holdouts, phased experiments, guardrails, and experiment analysis.

## MUST
- Online experiments MUST define hypothesis, primary metric, guardrails, target population, allocation, and stopping criteria before launch.
- Assignment MUST be stable at the intended experimental unit and protected from cross-arm contamination where practical.
- Experiment analysis MUST account for sample size, exposure duration, novelty effects, and material segment regressions.
- Safety, reliability, and policy guardrails MUST be able to stop or roll back harmful treatments.
- Experiment configuration and results MUST be traceable to the deployed model and ranking configuration.

## MUST NOT
- MUST NOT peek repeatedly and stop solely when a desired result appears without an approved sequential-testing method.
- MUST NOT expand traffic after a serious guardrail regression merely because the primary metric improved.
- MUST NOT combine incompatible experiment populations without explaining the effect on inference.

## SHOULD
- Long-term holdouts SHOULD be used when recommender changes can alter user or content-supply behavior.
- Experiment dashboards SHOULD include treatment exposure quality and invariant checks.

## Exceptions
Exceptions require documented urgency, risk controls, rollback readiness, and explicit approval.

## Verification
Inspect experiment specs, assignment tests, dashboards, statistical analysis, guardrail alerts, and rollout records.