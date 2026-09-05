# Capacity Observability

## Purpose
Build the telemetry needed to understand effective AI capacity, saturation risk, reserve, and forecast variance before user-facing degradation occurs.

## When to use
Use when capacity decisions rely on incomplete dashboards, saturation surprises recur, or planners cannot reconcile demand with utilization.

## Inputs
Metrics, traces, scheduler data, GPU telemetry, queue depth, model/token dimensions, quotas, regional capacity, SLOs, forecasts.

## Preconditions
Telemetry has stable identifiers for workload, model, region, hardware pool, and tenant class where appropriate.

## Context to inspect
GPU/CPU/memory/network metrics, token throughput, active sequences, queue wait, rejected work, autoscaling events, reservations, unavailable nodes, provider quota.

## Core knowledge
Physical capacity, allocated capacity, active utilization, schedulable capacity, and effective SLO-compliant capacity are different. Senior capacity observability tracks all of them.

## Procedure
1. Define capacity units per workload.
2. Instrument demand and supplied capacity consistently.
3. Track allocated, active, idle, reserved, unavailable, and stranded resources.
4. Add queue and rejection signals.
5. Track SLO-compliant throughput rather than utilization alone.
6. Expose headroom and failover reserve.
7. Compare actual demand with forecast.
8. Create exhaustion-date and anomaly alerts.
9. Validate dashboards against scheduler and billing sources.

## Decision points
Use workload-specific dashboards when aggregate fleet metrics hide bottlenecks. Alert on projected exhaustion when procurement lead time is long.

## Common failure patterns
Showing only GPU utilization, omitting unavailable capacity, mixing workload units, and alerting after saturation rather than before it.

## Verification
Operational teams can explain current headroom, queued demand, stranded capacity, and forecast exhaustion from the telemetry.

## Expected output
Capacity dashboards, alerts, and metric definitions with clear ownership.

## Stop conditions
Escalate when source telemetry is inconsistent enough to make capacity decisions unsafe.