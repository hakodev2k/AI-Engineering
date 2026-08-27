# Storage Observability and SLOs

## Purpose
Build observability that connects storage health to client-visible reliability and provides actionable early warning.

## When to use
Use for production readiness, monitoring redesign, recurring incidents, SLO definition, or alert-noise reduction.

## Inputs
Service objectives, storage topology, platform metrics, logs/events, client telemetry, capacity thresholds, and incident history.

## Context to inspect
Dashboards, alerts, exporters/agents, log retention, tracing, synthetic probes, ticket/runbook links, and ownership.

## Core knowledge
Storage health requires latency percentiles, errors, IOPS/throughput, saturation, queueing, capacity, replication/repair state, device health, and client symptoms. Alerts should identify actionable conditions before SLO failure.

## Procedure
1. Define user-facing availability and latency SLOs.
2. Map dependencies from clients to media/backend.
3. Instrument request success, tail latency, saturation, and capacity.
4. Add redundancy, replication, rebuild, checksum, and hardware-health signals.
5. Establish baselines and seasonality.
6. Create symptom-first dashboards with drill-down layers.
7. Set alerts on burn rate, safety margins, and actionable failure states.
8. Attach ownership and runbooks.
9. Test alert delivery and telemetry gaps.
10. Review false positives/negatives after incidents.

## Decision points
Page on urgent user impact or imminent durability risk; ticket lower-urgency capacity and maintenance conditions. Prefer SLO burn-rate alerts over static latency thresholds where service objectives are defined.

## Common failure patterns
Monitoring only device up/down, averages instead of percentiles, no client-side view, alert storms, missing repair backlog, and dashboards without owners.

## Verification
Inject safe failures or synthetic conditions, confirm signals/alerts, and verify operators can locate the fault path within the expected response time.

## Expected output
SLOs, dashboard hierarchy, alert policy, runbook links, and telemetry-gap register.

## Stop conditions
Escalate when critical data paths have no trustworthy telemetry or alerts cannot reach an accountable operator.