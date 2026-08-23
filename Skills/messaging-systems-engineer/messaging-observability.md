# Messaging Observability

## Purpose
Make asynchronous flows diagnosable through metrics, logs, traces and business correlation.

## When to use
Use for production messaging and incident investigation.

## Inputs
Broker metrics, application telemetry, SLOs, message metadata and tracing platform.

## Context to inspect
Queue/topic topology, consumer groups, correlation propagation and alert rules.

## Core knowledge
Useful signals include publish failures, processing latency, end-to-end age, backlog/lag, redelivery, DLQ rate and saturation. Queue depth alone lacks rate context.

## Procedure
1. Define messaging SLIs/SLOs.
2. Propagate correlation and trace context safely.
3. Emit structured producer/consumer telemetry.
4. Measure message age and processing duration.
5. Monitor backlog with ingress/egress rates.
6. Alert on user-impacting conditions.
7. Build drill-down dashboards and runbooks.

## Decision points
Sample high-volume traces while preserving errors and representative slow paths.

## Common failure patterns
Logging payload secrets, no correlation, alerts on raw depth and missing publish confirmation metrics.

## Verification
Trace test messages end-to-end and simulate lag/failure to validate alerts.

## Expected output
Actionable messaging telemetry and operational dashboards.

## Stop conditions
Escalate when telemetry would expose regulated or sensitive payloads without approved controls.