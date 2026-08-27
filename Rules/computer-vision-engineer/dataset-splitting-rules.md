# Dataset Splitting Rules

## Purpose
Prevent leakage and produce evaluation results that predict real deployment behavior.

## Scope
Training, validation, test, calibration, challenge, and temporal datasets.

## MUST
- Split strategy MUST reflect the deployment unit of independence, such as subject, scene, camera, site, sequence, or time period.
- Near-duplicates and correlated frames MUST be prevented from crossing splits when they would inflate performance.
- Test sets MUST remain isolated from iterative model and threshold selection.
- Split generation MUST be reproducible and versioned.

## MUST NOT
- Random frame-level splitting MUST NOT be used for correlated video when sequences can leak across splits.
- Test results MUST NOT be repeatedly optimized against and still described as unbiased holdout performance.

## SHOULD
- Separate temporal or site holdouts SHOULD be used when distribution shift is expected.

## Exceptions
Alternative splitting requires documented independence assumptions, leakage analysis, and reviewer approval for consequential evaluations.

## Verification
Check split code, hashes, entity overlap, duplicate detection, timestamps, sequence identifiers, and test-access history.