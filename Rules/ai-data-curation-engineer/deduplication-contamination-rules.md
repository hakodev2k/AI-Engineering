# Deduplication and Contamination Rules
## Purpose
Prevent duplicate-heavy datasets and leakage between training and evaluation assets.
## Scope
Exact duplicates, near duplicates, semantic duplicates, benchmark leakage, and cross-split contamination.
## MUST
- Deduplication strategy MUST match data modality and task risk.
- Training and evaluation datasets MUST be checked for exact and plausible near-duplicate contamination.
- Known benchmark or holdout contamination MUST be documented and addressed before model claims are accepted.
## MUST NOT
- Deduplication MUST NOT remove records solely on heuristic similarity without evaluating false-positive risk.
- Evaluation leakage MUST NOT be concealed by aggregate metrics.
## SHOULD
- High-value evaluation sets SHOULD maintain fingerprints or other reproducible contamination checks.
## Exceptions
Exceptions require quantified impact and approval.
## Verification
Review duplicate statistics, similarity thresholds, contamination reports, split comparisons, and sampled matches.