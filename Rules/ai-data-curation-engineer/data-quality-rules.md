# Data Quality Rules
## Purpose
Establish measurable quality controls for AI datasets.
## Scope
Raw, transformed, labeled, synthetic, training, validation, and evaluation datasets.
## MUST
- Quality criteria MUST be defined before dataset release, including completeness, validity, consistency, duplication, corruption, and task-specific fitness.
- Quality checks MUST produce evidence and thresholds, not subjective assurances.
- Material quality regressions MUST block release or require explicit approval.
## MUST NOT
- Missing values, malformed records, duplicates, or schema drift MUST NOT be ignored without impact assessment.
- Dataset quality MUST NOT be inferred from row count alone.
## SHOULD
- Quality metrics SHOULD be segmented by important cohorts and source types.
## Exceptions
Exceptions require documented impact, compensating controls, and approval.
## Verification
Review automated validation reports, sampled records, cohort metrics, failed checks, and release gates.