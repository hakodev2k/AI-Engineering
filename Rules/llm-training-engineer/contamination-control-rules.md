# Evaluation Contamination Control Rules

## Purpose
Protect the validity of evaluations by preventing train-test leakage and benchmark memorization.

## Scope
Training corpora, synthetic data, benchmark-derived content, prompts, solutions, evaluation holdouts, and data-generation pipelines.

## MUST
- Release-relevant evaluation sets MUST be screened against training data using methods appropriate to the content and leakage risk.
- Known benchmark prompts, answers, solutions, and close derivatives MUST have an explicit inclusion/exclusion policy.
- Contamination checks MUST account for normalized, paraphrased, templated, and near-duplicate forms where feasible.
- Suspected leakage MUST be reported with affected evaluations and uncertainty.
- Synthetic-data generators MUST be checked for benchmark exposure when their outputs can enter training.

## MUST NOT
- MUST NOT claim uncontaminated performance solely because exact-string matching found nothing.
- MUST NOT silently remove contaminated examples after observing scores and continue using the same aggregate without disclosure.
- MUST NOT expose protected holdouts broadly to training-data authors or optimization loops.

## SHOULD
- High-value holdouts SHOULD use access controls and auditable handling.
- Contamination analyses SHOULD be rerun after major data refreshes.

## Exceptions
Intentional benchmark training must be labeled and the benchmark must no longer be represented as an independent generalization measure.

## Verification
Review overlap reports, access controls, benchmark policies, synthetic-data lineage, data refresh checks, and adjusted evaluation results.