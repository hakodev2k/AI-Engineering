# Cardinality Rules
## Purpose
Prevent telemetry dimensions from destabilizing observability systems or costs.
## Scope
Metric labels, log fields, span attributes, indexes, and tags.
## MUST
- Estimate cardinality before introducing dynamic dimensions into indexed or metric data.
- Bound or transform identifiers that can grow without limit.
- Monitor active series/index growth for critical telemetry stores.
## MUST NOT
- Add request IDs, raw URLs, user IDs, or arbitrary payload values as metric labels.
- Approve high-cardinality changes without cost and capacity evidence.
## SHOULD
- Move exploratory high-cardinality context to traces or logs.
## Exceptions
Validated backend capabilities may support high cardinality when budgets and safeguards are explicit.
## Verification
Inspect series counts, index statistics, schema review, load tests, and cost trends.