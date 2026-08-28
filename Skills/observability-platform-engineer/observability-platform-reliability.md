# Observability Platform Reliability

## Purpose
Engineer the observability platform itself as a production service with explicit availability, durability, and degradation behavior.

## When to use
Use when setting platform reliability targets, reducing telemetry outages, or hardening shared collectors and backends.

## Inputs
Platform topology, dependencies, incident history, traffic, recovery objectives, tenant criticality.

## Context to inspect
Inspect redundancy, queue depth, replication, saturation, dependency health, backups, failover, and operator runbooks.

## Core knowledge
Understand failure domains, redundancy, graceful degradation, backpressure, recovery objectives, capacity headroom, and dependency isolation.

## Procedure
1. Define critical platform capabilities and acceptable degradation.
2. Establish SLIs/SLOs for ingestion, query, freshness, and loss.
3. Map single points of failure and shared dependencies.
4. Add redundancy across relevant failure domains.
5. Bound queues and define overload behavior.
6. Prioritize critical telemetry during saturation.
7. Test failover, restart, and backend recovery.
8. Maintain capacity headroom and growth forecasts.
9. Instrument the platform independently where possible.

## Decision points
Prefer graceful partial service over total failure; prioritize alerts, SLO metrics, and security telemetry when overload requires shedding.

## Common failure patterns
Observability depending entirely on the failing workload, no capacity margin, untested failover, and data-loss counters hidden from operators.

## Verification
Run controlled failure and overload tests and verify SLOs, recovery time, bounded loss, and tenant isolation.

## Expected output
A reliability plan with tested failure modes, recovery behavior, and platform SLOs.

## Stop conditions
Stop if testing could threaten production without an approved safe experiment.