# Data Leakage Rules
## Purpose
Protect evaluation integrity and production realism.
## Scope
Feature construction, splitting, preprocessing, tuning, and evaluation.
## MUST
- Split data according to the real inference boundary, including time, entity, or group constraints where applicable.
- Fit learned preprocessing only on permitted training data.
- Audit features for information unavailable at prediction time.
## MUST NOT
- Tune decisions against the final holdout set.
- Allow target-derived or future information into features unless explicitly available at inference.
## SHOULD
- Add automated leakage tests for known high-risk joins and features.
## Exceptions
Synthetic experiments must be clearly labeled and excluded from production claims.
## Verification
Review split logic, feature lineage, timestamps, preprocessing fit scope, and holdout access.