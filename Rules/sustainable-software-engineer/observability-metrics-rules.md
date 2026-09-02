# Sustainability Observability Rules

## Purpose
Make material software sustainability characteristics observable enough to support decisions, detect regressions, and validate outcomes.

## Scope
Applies to sustainability-related telemetry for compute, storage, network, workload volume, energy proxies, carbon estimates, and efficiency indicators.

## MUST
- Sustainability metrics MUST have documented definitions, units, data sources, aggregation windows, and ownership.
- Metrics used for decisions MUST distinguish workload growth from efficiency change where practical.
- Telemetry collection itself MUST be proportionate to the value of the evidence produced.
- Material regressions MUST be traceable to workload, configuration, deployment, or infrastructure changes when available evidence permits.

## MUST NOT
- MUST NOT create unbounded-cardinality telemetry solely for sustainability analysis.
- MUST NOT present modeled metrics as direct measurements without labeling them.
- MUST NOT suppress reliability or security telemetry to reduce observability overhead without explicit approval.

## SHOULD
- Track normalized measures such as resource use per transaction, job, request, build, model inference, or other useful unit of work.
- Establish trend views and regression thresholds for high-impact workloads.

## Exceptions
Exceptions require the missing signal, collection cost or platform limitation, proxy chosen, uncertainty, and review plan.

## Verification
Inspect metric definitions, dashboards, collection configuration, cardinality, data lineage, alert thresholds, and examples linking sustainability changes to deployment or workload evidence.
