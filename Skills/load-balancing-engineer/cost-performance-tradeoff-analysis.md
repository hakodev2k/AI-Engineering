# Cost and Performance Trade-off Analysis

## Purpose
Choose load-balancing designs that meet SLOs and resilience requirements without unnecessary infrastructure or network cost.

## When to use
Use for architecture selection, provider migration, scaling, cross-zone routing, or cost optimization.

## Inputs
Traffic volumes, pricing model, resource utilization, SLOs, failure requirements, operational effort, and growth forecast.

## Context to inspect
Inspect load-balancer charges, data processing, cross-zone/region transfer, public IP/NAT costs, TLS compute, logging volume, and staffing burden.

## Core knowledge
Lowest unit price can produce higher total cost through data transfer, operational complexity, overprovisioning, or outages. Performance must be measured at tail percentiles and under failure, not only steady-state averages.

## Procedure
1. Establish non-negotiable SLO and security constraints.
2. Build a current cost baseline by major driver.
3. Identify the performance bottleneck and required headroom.
4. Model candidate architectures under normal and failure load.
5. Include network transfer, telemetry, licenses, and operations.
6. Quantify savings and risk ranges.
7. Benchmark candidates where uncertainty is material.
8. Prefer reversible optimizations first.
9. Track realized cost and SLO after rollout.
10. Revisit assumptions as traffic changes.

## Decision points
Accept higher cost when it buys required isolation, recovery, or latency. Avoid cross-zone efficiency if transfer cost and dependency risk exceed utilization benefit.

## Common failure patterns
Optimizing invoice line items while increasing outage risk; ignoring data transfer; comparing average latency only; eliminating all headroom; underestimating operational complexity.

## Verification
Confirm actual cost trend and SLOs after rollout against the model, including peak and failure scenarios.

## Expected output
A quantified options analysis with cost, performance, resilience, risks, and recommendation.

## Stop conditions
Stop when pricing or traffic data is materially incomplete or proposed savings violate agreed reliability/security constraints.