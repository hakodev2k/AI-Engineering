# Evaluation Gating Rules

## Purpose
Prevent checkpoint promotion based on incomplete or misleading evidence.

## Scope
Offline evaluations used during training, checkpoint selection, release qualification, and regression analysis.

## MUST
- Promotion gates MUST cover target capabilities plus protected safety, robustness, and regression dimensions relevant to deployment.
- Evaluation datasets, harness versions, prompts, decoding settings, and scoring logic MUST be versioned.
- Final release evaluation MUST use a predeclared checkpoint-selection policy or clearly disclose post-selection bias.
- Material regressions MUST be investigated or explicitly accepted by an accountable human owner.
- Evaluation failures and missing slices MUST block claims about those dimensions.

## MUST NOT
- MUST NOT treat benchmark aggregate scores as sufficient when critical slices fail.
- MUST NOT compare results produced by materially different harnesses without reconciliation.
- MUST NOT tune directly against confidential holdouts in a way that destroys their validity.

## SHOULD
- Gates SHOULD include uncertainty or repeated sampling where model stochasticity matters.
- Evaluations SHOULD include deployment-like distributions and adversarial or stress cases.

## Exceptions
A waived gate requires documented impact, evidence, compensating controls, and human approval.

## Verification
Inspect evaluation manifests, harness revisions, score artifacts, slice reports, checkpoint-selection records, and signed waiver evidence for any failed gate.