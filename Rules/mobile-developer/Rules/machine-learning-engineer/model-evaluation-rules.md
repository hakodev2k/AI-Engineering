# Model Evaluation Rules
## Purpose
Require evidence that a model is fit for its intended use.
## Scope
Offline evaluation and promotion decisions.
## MUST
- Evaluate against an agreed baseline and predefined acceptance thresholds.
- Report metrics appropriate to class balance, ranking, calibration, regression error, or task risk rather than a convenient single metric.
- Evaluate critical cohorts and failure modes separately.
## MUST NOT
- Select metrics after seeing results solely to make a candidate appear better.
- Promote from aggregate metrics when critical cohorts fail required thresholds.
## SHOULD
- Include confidence intervals or repeated-run variability when material.
## Exceptions
Threshold changes require documented rationale and approval before promotion.
## Verification
Inspect evaluation code, holdout isolation, metric reports, cohort results, and baseline comparison.