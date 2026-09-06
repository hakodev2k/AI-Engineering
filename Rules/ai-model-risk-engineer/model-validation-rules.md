# Model Validation Rules

## Purpose
Require independent, evidence-based validation before material AI models are approved for production use.

## Scope
Applies to pre-deployment and periodic validation of model quality, limitations, controls, and fitness for intended use.

## MUST
- Validation MUST define acceptance criteria before final evaluation results are reviewed.
- Validation MUST test representative intended-use scenarios, foreseeable edge cases, and material failure modes.
- Validation MUST assess both model behavior and system-level controls that materially affect outcomes.
- High-risk models MUST receive review by personnel sufficiently independent from the implementation decision.
- Validation findings MUST distinguish blockers, accepted residual risks, and follow-up actions.

## MUST NOT
- Validation MUST NOT rely solely on developer-authored examples or cherry-picked successful outputs.
- A model MUST NOT be approved when critical acceptance criteria fail unless an explicitly authorized risk acceptance process permits it.

## SHOULD
- Validation SHOULD include reproducible datasets, prompts, configurations, and evaluator versions.
- Reviewers SHOULD challenge assumptions about deployment context and user behavior.

## Exceptions
Any deviation from standard validation must document the omitted evidence, reason, compensating controls, residual risk, and approver.

## Verification
Inspect validation plans, acceptance thresholds, test artifacts, evaluator outputs, issue logs, and approvals. Re-run representative tests when reproducibility is required.