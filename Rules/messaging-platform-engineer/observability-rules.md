# Observability Rules

## Purpose
Make message flow health, backlog, failures, and delivery behavior diagnosable from evidence.

## Scope
Broker metrics, client metrics, logs, traces, lag, queue age, throughput, errors, and alerts.

## MUST
- Monitoring MUST expose ingress, egress, error rate, consumer lag or queue depth, oldest-message age, and broker saturation where applicable.
- Telemetry MUST identify relevant topic/queue, consumer group, and deployment dimensions without leaking sensitive payloads.
- Alerts MUST represent actionable conditions and identify ownership.
- Production investigations MUST use logs, metrics, traces, and broker state rather than agent confidence.

## MUST NOT
- MUST NOT log message payloads containing sensitive data unless explicitly authorized and protected.
- MUST NOT rely on aggregate availability while individual partitions or consumer groups are stalled.
- MUST NOT remove lag or saturation telemetry required to evaluate capacity.

## SHOULD
- Correlate producer, broker, and consumer traces with stable message identifiers.

## Exceptions
Telemetry reductions require privacy/cost rationale and alternative evidence.

## Verification
Inspect dashboards, alert rules, trace samples, redaction, and incident evidence.