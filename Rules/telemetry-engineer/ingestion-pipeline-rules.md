# Ingestion Pipeline Rules

## Purpose
Keep telemetry ingestion reliable, bounded, and diagnosable under normal and failure conditions.

## Scope
Collectors, gateways, agents, queues, parsers, exporters, and ingestion services.

## MUST
- Ingestion stages MUST expose throughput, latency, error, drop, queue, and saturation metrics.
- Pipelines MUST define behavior for malformed data, downstream outages, and overload.
- Buffers and retries MUST be bounded.
- Data loss conditions MUST be observable and attributable to a pipeline stage.

## MUST NOT
- MUST NOT retry indefinitely or allow unbounded buffering.
- MUST NOT silently discard malformed or rejected telemetry without measurable accounting.
- MUST NOT couple producer availability to a noncritical telemetry backend without explicit design approval.

## SHOULD
- Prefer asynchronous, backpressure-aware export paths for production workloads.

## Exceptions
Require documented reason, bounded blast radius, evidence, and rollback plan.

## Verification
Inspect pipeline metrics, queue configuration, failure tests, exporter settings, and loss accounting.