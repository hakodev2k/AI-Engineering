# Human Evaluation Rules

## Purpose
Ensure human judgments are reliable, ethical, calibrated, and suitable for consequential AI quality decisions.

## Scope
Applies to expert review, crowd evaluation, preference ranking, safety review, pairwise comparison, and adjudication workflows.

## MUST
- Human evaluation tasks MUST provide clear instructions, rubric definitions, and examples before production labeling begins.
- Graders MUST be calibrated on a shared sample when consistency materially affects conclusions.
- High-impact disagreements MUST be adjudicated by a qualified reviewer or documented decision procedure.
- Evaluation design MUST minimize unnecessary exposure of reviewers to sensitive, harmful, or private content.
- Results MUST preserve enough metadata to analyze inter-rater agreement and systematic grader effects.

## MUST NOT
- MUST NOT treat a single uncalibrated reviewer as definitive evidence for subjective high-impact judgments.
- MUST NOT reveal candidate identity when blinded comparison is practical and disclosure could bias judgment.
- MUST NOT coerce reviewers to resolve ambiguity in favor of a preferred system.

## SHOULD
- Repeated tasks SHOULD include consistency checks and attention controls appropriate to the evaluation risk.
- Reviewer workload SHOULD be bounded to reduce fatigue-driven quality degradation.

## Exceptions
Expert single-reviewer assessment may be acceptable for narrow specialist questions when expertise is scarce; rationale, uncertainty, and review limits MUST be recorded.

## Verification
Inspect grader instructions, calibration artifacts, agreement statistics, adjudication records, blinding controls, reviewer qualification criteria, and sampled evaluation outputs.