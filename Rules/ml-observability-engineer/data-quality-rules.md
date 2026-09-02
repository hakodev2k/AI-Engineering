# Data Quality Observability

## Purpose
Detect production data defects that can corrupt inference, monitoring, or downstream decisions.

## Scope
Applies to model inputs, labels, features, joins, timestamps, schemas, and data pipelines used by production ML systems.

## MUST
- Critical data interfaces MUST monitor schema compatibility, freshness, completeness, validity, and volume appropriate to the workload.
- Data-quality checks MUST identify the affected source, time window, and downstream model exposure.
- Missing, malformed, duplicated, stale, or impossible values that can change model behavior MUST have explicit detection or safe handling.
- Data incidents MUST be distinguishable from model-performance incidents.

## MUST NOT
- MUST NOT silently coerce incompatible data in a way that hides upstream defects.
- MUST NOT treat successful pipeline execution as proof that data is semantically valid.
- MUST NOT weaken critical checks solely to reduce alert volume.

## SHOULD
- Validate distributions and cross-field invariants where schema checks are insufficient.
- Track data-quality debt and recurring source defects to closure.

## Exceptions
Excluded checks require documented risk, evidence that the condition is immaterial, and compensating controls.

## Verification
Review validation code, schema contracts, freshness metrics, anomaly history, downstream impact analysis, and test fixtures containing known data failures.