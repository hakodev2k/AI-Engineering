# Capacity and Cost Engineering

## Purpose
Keep shared platform capacity reliable and economically sustainable.

## When to use
Use for growth planning, cost anomalies, scaling limits, or resource-efficiency work.

## Inputs
Usage metrics, forecasts, billing data, quotas, SLOs, architecture, and workload patterns.

## Context to inspect
CPU, memory, storage, network, queue depth, autoscaling, reservations, idle resources, and service quotas.

## Core knowledge
Capacity requires headroom for bursts and failures. Cost optimization must preserve reliability and developer productivity.

## Procedure
1. Identify constrained resources and cost drivers.
2. Establish demand baselines and seasonality.
3. Forecast growth and failure headroom.
4. Validate autoscaling behavior and quotas.
5. Attribute cost to meaningful platform capabilities or tenants.
6. Remove waste with evidence.
7. Evaluate commitment discounts only for stable demand.
8. Re-test SLOs after optimization.

## Decision points
Scale out for parallelizable demand; scale up where coordination overhead dominates. Reserve capacity only when utilization confidence is sufficient.

## Common failure patterns
Optimizing bills without utilization data, zero headroom, unbounded autoscaling, ignored quotas, and cost allocation that drives bad behavior.

## Verification
Load tests and historical analysis demonstrate sufficient headroom; savings do not regress SLOs.

## Expected output
Capacity forecast, bottleneck risks, cost drivers, optimization actions, and guardrails.

## Stop conditions
Escalate imminent quota exhaustion or optimizations that require reliability trade-offs without owner approval.