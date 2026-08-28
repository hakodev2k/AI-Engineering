# Data Quality Rules

## Purpose
Ensure analytical outputs are supported by measurable data quality controls.

## Scope
Applies to source, staging, modeled, and published BI datasets.

## MUST
- Critical datasets MUST define quality expectations for completeness, uniqueness, validity, consistency, and referential integrity where relevant.
- Quality checks MUST distinguish blocking failures from informational anomalies.
- Known data defects MUST be surfaced to affected consumers when they materially change interpretation.
- Quality thresholds MUST be based on business impact rather than arbitrary percentages.

## MUST NOT
- MUST NOT suppress failing quality checks solely to keep a pipeline green.
- MUST NOT claim data is trustworthy without current validation evidence.

## SHOULD
- Recurring anomalies SHOULD be tracked to root cause rather than normalized indefinitely.

## Exceptions
Exceptions require documented defect scope, business impact, temporary compensating controls, and owner approval.

## Verification
Inspect test results, anomaly history, threshold rationale, incident records, and consumer notices.