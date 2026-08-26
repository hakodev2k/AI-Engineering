# GPU Production Observability

## Purpose
Instrument GPU services and jobs so capacity, performance, health, and failure modes are diagnosable in production.

## When to use
Use when operating GPU inference, training, rendering, HPC, or shared accelerator platforms.

## Inputs
Service/job architecture, GPU telemetry, SLOs, scheduler data, application metrics, logs, traces, topology.

## Preconditions
Define user-facing objectives and stable resource identities before building dashboards.

## Context to inspect
Inspect utilization by engine, memory used/reserved, power, temperature, clocks, throttling, ECC/health events, PCIe/interconnect traffic, queue time, kernel/request latency, allocation failures, and scheduler placement.

## Core knowledge
Aggregate GPU utilization is insufficient. Observability must connect application demand, queueing, accelerator activity, topology, and health. High-cardinality labels need control. Telemetry collection itself should not destabilize workloads.

## Procedure
1. Define SLOs and failure questions operators must answer.
2. Map request/job identifiers to GPU and node identity.
3. Collect resource, health, scheduler, and application metrics.
4. Correlate GPU timelines with distributed traces where practical.
5. Build dashboards around saturation, errors, latency, and capacity.
6. Alert on user impact and actionable hardware conditions, not noisy utilization alone.
7. Record software/driver/runtime versions for incidents.
8. Test telemetry during overload and device failure.
9. Establish retention appropriate for regression analysis.
10. Review alerts against actual incidents.

## Decision points
Prefer low-overhead continuous metrics and on-demand deep profiling. Alert on throttling or ECC based on persistence/severity. Sample high-volume traces while preserving rare errors.

## Common failure patterns
Only monitoring utilization, missing queue time, no GPU-to-workload attribution, cardinality explosions, alerting on harmless temperature spikes, and lacking version/topology metadata.

## Verification
Verify dashboards answer known incident scenarios, alerts fire in controlled tests, telemetry overhead is bounded, and application/GPU timestamps correlate correctly.

## Expected output
Production dashboards, actionable alerts, correlation fields, and an operator-ready diagnostic path.

## Stop conditions
Stop when telemetry requires unsafe privileges, collection overhead violates SLOs, or sensitive tenant identifiers cannot be handled according to policy.