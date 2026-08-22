# Model Evaluation Rules
## Purpose
Ensure reported performance predicts real decision quality.
## Scope
Offline validation, test sets, error analysis, and acceptance criteria.
## MUST
- Use metrics matched to decision costs and class/base-rate conditions.
- Evaluate relevant slices, uncertainty, calibration, and error modes before approval.
- Compare against baseline and predefined acceptance criteria.
## MUST NOT
- Report only aggregate metrics when subgroup failures can be consequential.
- Claim improvement without statistically and operationally meaningful evidence.
## SHOULD
- Include stress tests for distribution shifts and boundary cases.
## Exceptions
Missing slice data requires documented limitation and collection plan before consequential deployment.
## Verification
Inspect test protocol, metric definitions, confidence estimates, slice reports, error analysis, and acceptance evidence.