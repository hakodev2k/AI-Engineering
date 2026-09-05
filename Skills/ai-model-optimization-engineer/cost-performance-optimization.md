# Cost Performance Optimization

## Purpose
Optimize useful AI service output per unit cost while preserving quality, reliability, and latency requirements.

## When to use
For expensive inference, capacity planning, model/runtime selection, or cost regression.

## Inputs
Usage, hardware/provider pricing, utilization, model quality, latency, throughput, token/request distributions, operational overhead.

## Preconditions
Normalize comparisons to equivalent quality and service-level requirements.

## Context to inspect
Inspect accelerator occupancy, idle capacity, batching, model choice, precision, autoscaling, cache hit rates, egress, CPU/network, and reserved/on-demand economics.

## Core knowledge
Lowest unit hardware price is not lowest delivered cost. Cost per successful request/token/job must include utilization, retries, idle headroom, supporting resources, and quality-related rework.

## Procedure
1. Define the useful-work denominator.
2. Build current cost attribution by serving component.
3. Identify largest controllable cost drivers.
4. Generate alternatives across model, runtime, precision, batching, hardware, and scaling.
5. Benchmark each under equivalent quality/SLO gates.
6. Calculate steady and peak economics.
7. Include migration and operational complexity.
8. Run sensitivity analysis for traffic and pricing changes.
9. Select changes by risk-adjusted savings.
10. Monitor realized savings after rollout.

## Decision points
Prefer architecture/model simplification before micro-optimization when it yields larger durable savings. Avoid commitments when demand uncertainty outweighs discount.

## Common failure patterns
Cost per raw token without quality equivalence, ignoring idle capacity, comparing list price only, and savings that violate tail-latency SLOs.

## Verification
Billing/usage telemetry after rollout confirms expected savings while quality and SLO guardrails remain stable.

## Expected output
Cost model, ranked optimization opportunities, benchmark evidence, projected/realized savings, and assumptions.

## Stop conditions
Stop if cost attribution or workload equivalence is too incomplete for a defensible decision.