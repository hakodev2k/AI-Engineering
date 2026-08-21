# Data Quality Rules
## Purpose
Prevent models from learning from invalid or misleading data.
## Scope
Training, validation, test, and inference data.
## MUST
- Define and validate schema, ranges, nullability, uniqueness, freshness, and domain invariants for critical features and labels.
- Quantify missingness, outliers, duplicates, and distribution anomalies before training.
- Fail or quarantine data that violates safety-critical invariants.
## MUST NOT
- Silently coerce malformed data into plausible values.
- Assume upstream data quality without evidence.
## SHOULD
- Automate quality checks at ingestion and before training.
## Exceptions
Document reason, impact, compensating control, and approval.
## Verification
Inspect data-quality reports, validation code, rejected records, and pipeline tests.