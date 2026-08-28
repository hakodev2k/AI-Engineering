# Ranking Model Rules

## Purpose
Ensure ranking models are correct, measurable, and safe to deploy.

## Scope
Applies to model selection, architecture, scoring, calibration, and inference behavior.

## MUST
- Ranking models MUST have documented inputs, outputs, training objective, serving contract, and supported feature versions.
- Model changes MUST be evaluated against a stable baseline using offline and online evidence appropriate to impact.
- Score semantics and calibration assumptions MUST be documented when downstream logic depends on score magnitude.
- Inference failures MUST have explicit fallback behavior.
- Model artifacts MUST be versioned and traceable to training data, code, configuration, and evaluation results.

## MUST NOT
- MUST NOT deploy an unversioned model artifact.
- MUST NOT compare models using incompatible datasets or metric definitions without normalization.
- MUST NOT infer production benefit from training loss alone.

## SHOULD
- Model complexity SHOULD be justified by measurable incremental value relative to operational cost.
- Ranking architectures SHOULD preserve debuggability of major decision factors where practical.

## Exceptions
Exceptions require documented constraints, evidence, risk, and approval for production-impacting deviations.

## Verification
Check model registry metadata, evaluation reports, serving contract tests, fallback tests, and artifact lineage.