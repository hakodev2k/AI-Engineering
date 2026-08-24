# Model Evaluation Gate Rules

## Purpose
Require evidence that a candidate is fit for its intended production use before promotion.

## Scope
Applies to offline evaluation, robustness tests, subgroup checks, regression gates, and release acceptance.

## MUST
- Every production candidate MUST pass documented acceptance criteria tied to intended use and failure cost.
- Evaluation MUST include a baseline or current-production comparison where one exists.
- Critical regressions MUST block promotion unless explicitly risk-accepted by an accountable human.
- Evaluation datasets and metric implementations MUST be versioned.
- Statistical uncertainty or sample limitations MUST be considered when they could change the decision.

## MUST NOT
- Aggregate accuracy alone MUST NOT justify release when important failure modes require separate metrics.
- Test-set leakage or repeated tuning against a nominal holdout MUST NOT be treated as unbiased evaluation.

## SHOULD
- Gates SHOULD cover robustness, calibration, fairness or subgroup behavior, latency/cost, and safety when relevant.
- Thresholds SHOULD be machine-enforced in CI/CD where practical.

## Exceptions
A waived gate requires reason, evidence, user/operational impact, rollback plan, monitoring, expiry, and explicit approval.

## Verification
Review evaluation manifests, metric code, dataset versions, threshold results, baseline comparisons, waiver records, and automated gate outcomes.