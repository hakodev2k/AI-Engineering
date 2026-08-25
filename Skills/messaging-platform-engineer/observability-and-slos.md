# Messaging Observability and SLOs

## Purpose
Build observability that explains messaging health from producer through broker to consumer and turns platform behavior into actionable SLOs.

## When to use
Use when defining dashboards, alerts, SLOs, or troubleshooting blind spots.

## Inputs
- Platform SLOs
- Broker and client metrics
- Critical message flows
- Incident history

## Context to inspect
Inspect existing metrics, logs, traces, dashboards, alerts, lag measurements, broker health indicators, and ownership metadata.

## Core knowledge
Useful signals include publish latency/errors, broker availability, under-replication, queue depth, consumer lag, processing latency, retries, DLQ growth, disk/network saturation, and client rebalances. SLOs should reflect user-visible messaging outcomes.

## Procedure
1. Identify critical producer-to-consumer journeys.
2. Define availability, latency, durability, and recovery objectives.
3. Instrument producers, brokers, and consumers with correlated identifiers where practical.
4. Measure lag in both records and time.
5. Build dashboards around symptoms and causes.
6. Alert on SLO risk, sustained backlog growth, replication health, and error-budget burn.
7. Add ownership and runbook links to alerts.
8. Review telemetry cardinality and cost.
9. Test alerts with controlled failures.

## Decision points
Prefer symptom-based paging and cause-oriented dashboards. Use high-cardinality dimensions only where investigation value justifies telemetry cost.

## Common failure patterns
- Paging on every broker metric
- Lag dashboards without time-based context
- No producer-side error visibility
- Alerts without owners or runbooks
- DLQ growth visible only during incidents

## Verification
Trigger broker, producer, and consumer faults; confirm alerts fire at useful thresholds and dashboards identify the failing stage.

## Expected output
A messaging observability standard with SLOs, telemetry, dashboards, alerts, and ownership.

## Stop conditions
Stop when no service objective can be tied to consumer impact, telemetry sources are unreliable, or alerts cannot route to accountable owners.