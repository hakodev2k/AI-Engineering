# Leakage and Memorization Rules

## Purpose
Prevent synthetic outputs from reproducing source records, hidden labels, evaluation answers, or other information that invalidates privacy or downstream measurement.

## Scope
Applies to generators trained or conditioned on real data and to datasets used for model training, benchmarking, validation, or red-team exercises.

## MUST
- Test for exact and near-duplicate overlap between synthetic outputs and protected source records.
- Evaluate memorization risk using similarity, nearest-neighbor, canary, or attack-based methods appropriate to the modality.
- Keep evaluation and benchmark targets isolated from generator inputs when synthetic data will be used to measure those targets.
- Define leakage thresholds before release and block outputs that exceed them.
- Investigate suspiciously high downstream benchmark gains for hidden contamination or target leakage.

## MUST NOT
- Treat paraphrasing, formatting changes, or minor perturbation as proof that a source record was not copied.
- Generate test data from the same answer-bearing corpus used to score the system without explicit contamination controls.
- Release known memorized sensitive samples.
- Ignore duplicate or near-duplicate findings because the aggregate dataset is large.

## SHOULD
- Maintain holdout sources unknown to the generator for leakage detection.
- Use adversarial probes for highly capable generative models.
- Track leakage metrics across generator versions.

## Exceptions
Any accepted overlap must be intentionally public or non-sensitive, justified for the use case, and documented with reviewer approval.

## Verification
Inspect overlap reports, similarity distributions, canary tests, benchmark provenance, contamination checks, and release-gate evidence showing all thresholds passed.