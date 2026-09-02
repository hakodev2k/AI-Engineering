# Graph Observability and Operations

## Purpose
Operate graph systems reliably by monitoring workload health, graph-specific failure modes, freshness, ingestion lag, traversal behavior, and resource saturation.

## When to use
Use when deploying or running production knowledge graphs, establishing SLOs, reviewing capacity, or diagnosing recurring instability.

## Inputs
Service architecture, SLOs, graph engine metrics, query logs, ingestion metrics, topology statistics, infrastructure metrics, alerts, and incident history.

## Preconditions
Identify critical user journeys and separate ingestion, query, storage, and reasoning workloads.

## Context to inspect
Latency distributions, query plans, cache ratios, transaction failures, replication lag, storage growth, degree distribution, ingestion lag, rejected records, GC/memory pressure, and backup status.

## Core knowledge
Graph systems need conventional infrastructure telemetry plus semantic and topology signals. A healthy server can still serve stale or structurally broken knowledge. Senior operations therefore monitor both platform health and graph correctness/freshness.

## Procedure
1. Define SLOs for critical reads, writes, and freshness.
2. Instrument p50/p95/p99 query latency by query class.
3. Track errors, retries, transaction conflicts, and timeouts.
4. Monitor ingestion lag, validation rejection, and replay backlog.
5. Track node/edge growth and high-degree distributions.
6. Monitor indexes, cache behavior, memory, CPU, disk, and network.
7. Track replication and backup health where applicable.
8. Create alerts tied to user impact rather than raw thresholds alone.
9. Build dashboards that correlate graph and infrastructure signals.
10. Capture slow-query exemplars and execution plans.
11. Define runbooks for capacity, stale data, corruption, and failover.
12. Review alert quality and operational debt after incidents.

## Decision points
Alert on symptoms when possible and diagnostics when actionable. Sample high-volume query telemetry carefully to control cost while retaining tail and failure visibility.

## Common failure patterns
Monitoring only CPU; average latency hiding tail failures; no freshness SLO; missing topology growth signals; noisy alerts; and backups never restored in drills.

## Verification
Exercise alerts, run restore/failover drills, compare dashboard signals during load tests, and verify SLO calculations against raw events.

## Expected output
Graph-specific SLOs, dashboards, alerts, runbooks, capacity signals, and validated recovery telemetry.

## Stop conditions
Stop when critical telemetry cannot be collected safely or operational changes require privileged production actions without authorization.