# Data Quality Rules
## Purpose
Prevent invalid conclusions caused by unfit data.
## Scope
All analytical and modeling datasets.
## MUST
- Profile completeness, validity, uniqueness, consistency, freshness, and relevant distribution characteristics before use.
- Define critical quality thresholds and fail or quarantine inputs that violate them.
- Trace material anomalies to source or transformation causes.
## MUST NOT
- Silently impute, drop, or alter anomalous records when the choice can change conclusions.
- Assume a large dataset is representative or correct.
## SHOULD
- Automate recurring quality checks at ingestion and before training or analysis.
## Exceptions
Accepted defects require documented impact and owner approval.
## Verification
Inspect profiling reports, validation tests, anomaly evidence, and exception records.