# Bias and Fairness Rules

## Purpose
Detect and control ranking behavior that systematically disadvantages relevant content or user groups without justified relevance reasons.

## Scope
Applies to labels, behavioral feedback, ranking signals, personalization, exposure, and evaluation segments.

## MUST
- Material ranking changes MUST be assessed for systematic exposure or quality shifts across relevant segments where such analysis is appropriate and lawful.
- Behavioral labels MUST be reviewed for feedback-loop and position-bias effects before being treated as ground truth.
- Fairness constraints, when required, MUST be explicit and tested as part of release evaluation.
- Known bias risks MUST have documented monitoring or mitigation.

## MUST NOT
- MUST NOT interpret historical engagement as unbiased relevance evidence by default.
- MUST NOT use sensitive attributes casually as ranking features.
- MUST NOT claim fairness from aggregate metrics alone when meaningful subgroup analysis is required.

## SHOULD
- Use counterfactual, debiasing, or balanced evaluation methods when behavioral data is materially biased.

## Exceptions
Require documented purpose, methodology, risk, and appropriate approval.

## Verification
Review feature definitions, label-generation logic, segment metrics, exposure analysis, and release documentation.