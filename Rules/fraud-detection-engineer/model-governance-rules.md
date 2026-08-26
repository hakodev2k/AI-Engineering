# Model Governance Rules

## Purpose
Govern statistical and machine-learning fraud models throughout their lifecycle.

## Scope
Training, validation, approval, deployment, monitoring, replacement, and retirement.

## MUST
- Production models MUST be versioned with reproducible training inputs, code, configuration, and evaluation evidence.
- Model approval MUST consider fraud capture, false positives, calibration, stability, latency, and relevant subgroup risks.
- Material model changes MUST use controlled rollout and rollback criteria.
- Models MUST have named ownership and retirement criteria.

## MUST NOT
- MUST NOT promote a model solely because aggregate offline accuracy improved.
- MUST NOT silently substitute model versions or feature definitions.

## SHOULD
- Challenger evaluation SHOULD be used for material replacements.
- Model cards or equivalent records SHOULD document intended use and limitations.

## Exceptions
Require documented rationale, bounded risk, evidence, validation, and accountable approval.

## Verification
Inspect model registry, lineage, evaluation reports, approvals, deployment records, monitoring, and rollback tests.