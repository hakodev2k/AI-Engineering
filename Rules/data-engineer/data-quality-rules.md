# Data Quality Rules
## Purpose
Prevent invalid, incomplete, stale, or inconsistent data from silently becoming trusted output.
## Scope
Ingestion, transformation, storage, serving, and published datasets.
## MUST
- Critical datasets MUST define measurable quality checks for validity, completeness, uniqueness, consistency, and freshness where relevant.
- Failed quality gates MUST produce actionable evidence and clear ownership.
- Quality thresholds MUST reflect business impact rather than arbitrary percentages.
- Corrections MUST preserve auditability when trusted outputs were previously wrong.
## MUST NOT
- MUST NOT suppress failing checks merely to keep pipelines green.
- MUST NOT certify data as accurate without defined evidence.
## SHOULD
- Prefer automated checks close to the point where defects can first be detected.
## Exceptions
Temporary threshold changes require documented evidence, risk, expiry, and approval.
## Verification
Inspect tests, quality dashboards, failed-record samples, incident history, and correction records.