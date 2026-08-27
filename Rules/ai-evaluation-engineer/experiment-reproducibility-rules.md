# Experiment Reproducibility Rules

## Purpose
Ensure AI evaluation results can be reproduced, audited, and compared over time.

## Scope
Applies to offline evaluations, benchmark runs, A/B analyses, model comparisons, judge pipelines, and release-candidate experiments.

## MUST
- Every consequential evaluation run MUST record the model or artifact version, prompt or policy version, dataset version, evaluator version, runtime configuration, and execution timestamp.
- Randomized evaluations MUST record seeds or enough run metadata to estimate and reproduce variance.
- Evaluation code and configuration used for release decisions MUST be version-controlled.
- External dependencies that can change results MUST be pinned, snapshotted, or explicitly recorded where practical.
- Re-running the same immutable configuration MUST produce materially consistent conclusions or documented variance bounds.

## MUST NOT
- MUST NOT overwrite historical results in place when the underlying configuration or dataset changes.
- MUST NOT present manually edited outputs as raw evaluation evidence without an audit trail.
- MUST NOT compare runs whose key configuration differences are unknown.

## SHOULD
- Evaluation artifacts SHOULD be machine-readable and linked to source revisions.
- Deterministic preprocessing and grading SHOULD be preferred where they do not reduce evaluation validity.

## Exceptions
Exploratory notebook work may use lighter controls until findings become decision-relevant; promoted findings MUST then be reproduced under controlled configuration.

## Verification
Inspect run manifests, source revisions, immutable dataset references, evaluator configuration, seeds, dependency metadata, and rerun results. Confirm a reviewer can reconstruct at least one release-relevant evaluation from recorded artifacts.