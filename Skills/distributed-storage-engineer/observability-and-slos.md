# Observability and SLOs

## Purpose
Build observability and SLOs that reveal distributed-storage health before users experience data unavailability, excessive latency, or durability risk.

## When to use
Use when designing dashboards and alerts, defining service objectives, onboarding a storage system to production, or improving incident detection.

## Inputs
User journeys, latency/error objectives, durability and availability targets, topology, request paths, replication metrics, capacity metrics, and incident history.

## Preconditions
Define user-visible service outcomes and operational risks rather than starting from whatever metrics are easiest to collect.

## Context to inspect
Request metrics, logs, traces, replica health, queue depths, compaction, repair, capacity, node health, metadata service, backup status, and client telemetry.

## Core knowledge
Storage reliability includes latent risk that may not immediately affect request success, such as under-replication, old repair backlog, or backup failure. SLOs should therefore cover both user-facing service and durability-related health. High-cardinality dimensions require deliberate sampling and aggregation.

## Procedure
1. Define user-facing availability and latency SLIs.
2. Define durability-risk indicators such as under-replication and repair age.
3. Define capacity and recovery-headroom indicators.
4. Instrument request stages with stable correlation identifiers.
5. Capture error classes rather than one aggregate error count.
6. Add per-partition/node/zone breakdowns where actionable.
7. Define SLO windows and error budgets.
8. Create alerts on symptoms and critical risk states, not raw noise.
9. Build drill-down paths from service to replica and storage-engine layers.
10. Validate dashboards during controlled failure scenarios.
11. Review alert usefulness after incidents.
12. Remove or redesign unactionable telemetry.

## Decision points
Page on conditions requiring immediate human action; ticket or dashboard slower capacity and maintenance risks. Prefer percentiles and histograms over averages for latency.

## Common failure patterns
Monitoring only CPU and disk, no durability-risk indicators, alerting on every node restart, dashboards without ownership, cardinality explosions, and metrics that cannot distinguish client failure from internal recovery work.

## Verification
Trigger representative degraded conditions and confirm alerts, dashboards, and traces identify the correct layer and affected scope within the expected detection time.

## Expected output
SLIs, SLOs, alerts, dashboards, trace/log conventions, and documented investigation paths.

## Stop conditions
Stop when telemetry cannot distinguish user-visible failure from internal health or when alert thresholds lack an operational response.