# Experiment and A/B Testing Rules

## Purpose
Evaluate routing changes safely under real traffic without corrupting conclusions or exposing users to uncontrolled risk.

## Scope
A/B tests, shadow traffic, canaries, randomization, assignment, guardrails, and experiment analysis.

## MUST
- Experiments MUST define hypothesis, population, primary metrics, guardrails, duration or stopping criteria, and rollback conditions before activation.
- Assignment MUST be stable where repeated-user consistency matters.
- Safety, privacy, and contractual eligibility MUST be enforced before experimental assignment.
- Experiment exposure MUST be measurable by route and configuration version.
- Decisions MUST account for uncertainty and material segment regressions, not only aggregate point estimates.

## MUST NOT
- MUST NOT use sensitive production traffic for shadow evaluation when provider or retention constraints prohibit it.
- MUST NOT change assignment logic mid-experiment without documenting the analytical impact.
- MUST NOT declare success solely from a favorable short-term fluctuation.

## SHOULD
- Prefer canary exposure before broad A/B testing for high-impact changes.
- Predefine guardrails for cost, latency, errors, and quality.

## Exceptions
Exceptions require experimental rationale, risk controls, and approval.

## Verification
Inspect experiment configuration, assignment tests, metric definitions, exposure logs, statistical analysis, and rollback evidence.