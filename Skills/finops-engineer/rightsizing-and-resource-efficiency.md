# Rightsizing and Resource Efficiency

## Purpose
Reduce overprovisioning while preserving workload performance, resilience, and operational headroom.

## When to use
Use for compute, databases, containers, storage, or managed services with persistent low utilization or inefficient shapes.

## Inputs
Resource inventory, CPU/memory/IO metrics, request/limit data, latency, SLOs, autoscaling configuration, billing rates, seasonality.

## Context to inspect
Inspect peak and percentile utilization, burst behavior, memory pressure, throttling, failover capacity, deployment topology, scaling limits, and licensing constraints.

## Core knowledge
Average utilization is insufficient. Rightsizing must consider peaks, tails, failure modes, vertical/horizontal scaling, minimum redundancy, and performance nonlinearities.

## Procedure
1. Select candidates using cost and utilization evidence.
2. Determine workload owner and SLO constraints.
3. Analyze long enough to capture business cycles.
4. Measure CPU, memory, IO, network, latency, and throttling as relevant.
5. Identify required reliability headroom.
6. Compare smaller shapes, autoscaling, scheduling, or architectural changes.
7. Estimate savings and operational risk.
8. Change in a controlled environment or canary where possible.
9. Observe performance after change.
10. Roll back or standardize based on evidence.

## Decision points
Prefer autoscaling for variable demand, scheduling for idle nonproduction workloads, and shape changes for stable overprovisioning. Do not trade required redundancy for utilization targets.

## Common failure patterns
Sizing from averages, ignoring memory, downsizing replicas needed for failure tolerance, applying provider recommendations blindly, and claiming savings before billing confirms them.

## Verification
SLOs and saturation metrics remain healthy; billing shows realized savings; rollback path is tested; capacity remains adequate under expected failure scenarios.

## Expected output
A prioritized rightsizing plan with evidence, savings estimate, risk, owner, implementation result, and realized savings.

## Stop conditions
Escalate when telemetry is insufficient, workload peaks are unknown, or changes can violate availability requirements.