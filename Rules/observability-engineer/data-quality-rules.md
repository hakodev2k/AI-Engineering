# Observability Data Quality Rules
## Purpose
Ensure operational decisions use correct, timely, and interpretable telemetry.
## Scope
Completeness, freshness, schema, timestamps, units, and aggregation.
## MUST
- Validate timestamps, units, field semantics, and schema changes for critical signals.
- Detect material ingestion gaps and stale data.
- Preserve source identity and transformation lineage for derived critical indicators.
## MUST NOT
- Treat missing telemetry as zero unless the data model explicitly guarantees that meaning.
- Merge incompatible units or populations in one metric.
## SHOULD
- Add automated data-quality checks for SLO and alert inputs.
## Exceptions
Approximate exploratory telemetry may use weaker guarantees when clearly labeled.
## Verification
Compare source and derived samples, freshness checks, schema tests, and gap detection.