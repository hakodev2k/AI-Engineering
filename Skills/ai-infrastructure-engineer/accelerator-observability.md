# Accelerator Observability

## Purpose
Build observability for GPUs and AI workloads that exposes utilization, memory pressure, thermal/power issues, queueing, failures, and workload-level efficiency.

## When to use
Use when operating shared accelerator fleets or diagnosing cost/performance/reliability issues.

## Inputs
GPU metrics, host metrics, scheduler data, workload metadata, logs, traces, and SLOs.

## Context to inspect
Exporter coverage, metric cardinality, labels, dashboards, alerts, workload correlation, retention, and incident history.

## Core knowledge
GPU utilization alone is insufficient. Useful telemetry includes HBM use, SM activity, tensor-core use where available, power, temperature, ECC/Xid errors, PCIe/NVLink traffic, queue time, and application throughput.

## Procedure
1. Define operational questions and SLOs first.
2. Collect accelerator, node, fabric, scheduler, and application signals.
3. Correlate metrics by workload, model, tenant, node, and accelerator.
4. Add error and health-event ingestion.
5. Build saturation, fragmentation, and efficiency views.
6. Alert on user-impacting symptoms and actionable hardware faults.
7. Control high-cardinality dimensions.
8. Validate dashboards during load and fault tests.
9. Review telemetry gaps after incidents.

## Decision points
Prefer workload-centric dashboards for service owners and fleet-centric views for platform operators. Page on actionable failure, not routine high utilization.

## Common failure patterns
Only monitoring GPU utilization, missing workload identity, alert storms, ignored Xid/ECC events, and dashboards without SLO context.

## Verification
Inject or reproduce representative faults and confirm signals, correlation, alerts, and runbooks work.

## Expected output
Operational dashboards, alerts, and a documented telemetry model.

## Stop conditions
Stop when required metrics cannot be collected safely or ownership for alerts is undefined.