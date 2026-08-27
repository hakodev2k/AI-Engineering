# Observability and SLOs

## Purpose
Build telemetry that reveals distributed database health from client experience down to individual partitions and replicas.

## When to use
Use for production readiness, monitoring redesign, incident prevention, and SLO definition.

## Inputs
User journeys, availability targets, topology, database metrics, tracing/logging capabilities, incident history.

## Context to inspect
Client latency/error metrics, node health, replication lag, queue depth, disk/network, shard balance, transaction conflicts, and alerts.

## Core knowledge
Node-up status is not service health. Distributed systems require topology-aware metrics and tail distributions. Symptoms such as client errors and latency should be paired with causes such as saturation, lag, elections, and hotspots.

## Procedure
1. Define database service indicators from client-visible outcomes.
2. Set SLOs and error budgets.
3. Instrument p50/p95/p99 latency and errors by operation.
4. Add per-shard/replica saturation and lag metrics.
5. Track elections, retries, conflicts, repairs, and rebalances.
6. Correlate requests with traces where supported.
7. Build topology-aware dashboards.
8. Alert on actionable symptoms and fast exhaustion.
9. Validate alerts through controlled failures.

## Decision points
Page on urgent user-impact or imminent data risk; ticket slower capacity, skew, or repair trends. Avoid paging on redundant low-level symptoms.

## Common failure patterns
Average-only latency, node-centric dashboards, alert storms, missing shard dimensions, no client telemetry, and dashboards without operational decisions.

## Verification
Inject representative failures and confirm telemetry identifies user impact, affected scope, and likely cause within operational targets.

## Expected output
SLOs, dashboards, actionable alerts, diagnostic queries, and validated telemetry coverage.

## Stop conditions
Stop declaring readiness if critical client paths or data-risk conditions cannot be observed.