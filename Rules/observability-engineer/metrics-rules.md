# Metrics Rules
## Purpose
Measure service behavior efficiently and consistently.
## Scope
Counters, gauges, histograms, summaries, and derived indicators.
## MUST
- Define metric name, unit, semantics, ownership, and aggregation behavior.
- Use monotonic counters for cumulative events where appropriate.
- Select histogram boundaries from meaningful latency or size ranges.
## MUST NOT
- Put unbounded identifiers such as request IDs in metric labels.
- Change metric semantics silently under an existing name.
## SHOULD
- Prefer dimensions that support actionable segmentation with bounded cardinality.
## Exceptions
High-cardinality analysis belongs in logs/traces unless a validated metrics backend use case justifies it.
## Verification
Review metric descriptors, label cardinality, dashboards, and sample aggregations.