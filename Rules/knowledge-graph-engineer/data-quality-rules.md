# Graph Data Quality Rules

## Purpose
Detect semantic and structural defects before they corrupt downstream graph decisions.

## Scope
Completeness, validity, uniqueness, consistency, relationship coverage, duplicates, and anomalous graph patterns.

## MUST
- Critical graph domains MUST define measurable quality expectations tied to business semantics.
- Quality checks MUST distinguish missing source data from ingestion or mapping failures.
- Unexpected duplicate entities, orphan relationships, and cardinality anomalies MUST be investigated.
- Material quality regressions MUST block promotion when they threaten consumer correctness.

## MUST NOT
- MUST NOT rely on schema validity alone as proof of semantic quality.
- MUST NOT hide malformed values behind defaults that appear legitimate.
- MUST NOT dismiss distribution or topology changes without evidence.

## SHOULD
- Baseline graph-quality metrics over representative periods.
- Add regression checks after confirmed data incidents.

## Exceptions
Accepted anomalies require evidence, bounded scope, expiry, and owner approval.

## Verification
Inspect quality dashboards, anomaly reports, validation runs, and incident follow-up tests.