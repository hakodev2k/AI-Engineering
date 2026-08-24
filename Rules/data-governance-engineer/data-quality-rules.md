# Data Quality Rules
## Purpose
Make data fitness measurable, owned, and actionable.
## Scope
Critical data elements, data products, analytical datasets, and operational exchanges.
## MUST
- Critical data MUST have explicit quality dimensions, thresholds, owners, and measurement frequency.
- Quality rules MUST reflect business semantics rather than only technical validity.
- Threshold breaches MUST create traceable remediation or accepted-risk records.
## MUST NOT
- Data MUST NOT be declared high quality without measured evidence.
- Failed checks MUST NOT be silently suppressed to preserve dashboards or SLAs.
## SHOULD
- Quality controls SHOULD run as close as practical to creation and transformation boundaries.
## Exceptions
Temporary threshold relaxation requires evidence, impact analysis, expiry, and owner approval.
## Verification
Inspect quality definitions, execution history, breach records, remediation evidence, and trend metrics.