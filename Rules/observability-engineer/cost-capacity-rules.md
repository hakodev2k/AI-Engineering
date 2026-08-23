# Observability Cost and Capacity Rules
## Purpose
Keep observability economically sustainable without destroying diagnostic value.
## Scope
Ingestion, storage, queries, egress, indexing, and capacity.
## MUST
- Measure telemetry volume and cost by major source or service where feasible.
- Forecast material schema, cardinality, retention, or sampling changes before rollout.
- Protect critical telemetry from indiscriminate cost cuts.
## MUST NOT
- Claim cost optimization without before/after evidence.
- Remove critical incident evidence solely because it is expensive without risk review.
## SHOULD
- Optimize noisy low-value telemetry before reducing high-value signals.
## Exceptions
Budget emergencies require explicit risk acceptance and restoration/replacement plan.
## Verification
Review cost allocation, ingest/storage trends, query usage, forecasts, and post-change measurements.