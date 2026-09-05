# Cardinality Control Rules

## Purpose
Prevent telemetry dimensions from causing ingestion instability, excessive cost, or unusable queries.

## Scope
Metric labels, log fields used for indexing, trace attributes, event dimensions, and aggregation keys.

## MUST
- Every indexed or aggregated dimension MUST have an understood cardinality bound or measured distribution.
- High-cardinality identifiers MUST be excluded from metric labels unless the backend and use case explicitly support them.
- Cardinality-impacting changes MUST be load-tested or estimated before broad rollout.
- Telemetry pipelines MUST expose evidence of label or dimension explosion where the platform supports it.

## MUST NOT
- MUST NOT use request IDs, user IDs, timestamps, or arbitrary URLs as metric labels by default.
- MUST NOT introduce unbounded dimensions merely for debugging convenience.

## SHOULD
- Put high-cardinality correlation values in logs or traces rather than aggregated metric labels.

## Exceptions
Require measured need, backend capacity evidence, cost impact, retention impact, and approval for material risk.

## Verification
Review schemas, emitted samples, cardinality reports, backend quotas, query plans, and load tests.