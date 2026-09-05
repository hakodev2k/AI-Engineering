# Cost Efficiency Optimization

## Purpose
Reduce model-serving cost per useful request or token without violating latency, availability, quality, or safety requirements.

## When to use
Use during FinOps reviews, hardware migrations, model changes, utilization problems, or when serving cost grows faster than demand.

## Inputs
Compute cost, accelerator utilization, request/token volume, model mix, latency SLOs, quality constraints, energy/power data when available, and capacity headroom.

## Preconditions
Cost must be attributed by model, route, hardware pool, and workload class closely enough to support decisions.

## Context to inspect
Idle capacity, batching, quantization, model routing, autoscaling, spot/preemptible options, cache hit rates, context/output sizes, parallelism overhead, and regional pricing.

## Core knowledge
The cheapest accelerator or model is not necessarily the lowest-cost serving option. Cost efficiency depends on usable throughput, memory fit, utilization, startup overhead, failure rate, and quality-adjusted work completed.

## Procedure
1. Establish baseline cost per request and per generated token by workload.
2. Identify idle capacity and low-utilization pools.
3. Measure whether queueing or SLO constraints justify current headroom.
4. Evaluate batching, autoscaling, quantization, and model-routing opportunities.
5. Compare hardware using measured throughput per unit cost.
6. Reduce unnecessary context and output budgets where product behavior permits.
7. Validate lower-cost models only on eligible workloads.
8. Test preemptible capacity for interruption-tolerant traffic.
9. Recalculate cost after reliability and quality impacts.
10. Roll out savings gradually with SLO guardrails.

## Decision points
Choose optimization based on total cost of reliable, quality-compliant service. Keep premium capacity for workloads whose SLO or quality requirements justify it.

## Common failure patterns
Optimizing hourly GPU price instead of cost per useful work, overpacking replicas until tail latency rises, using cheaper models without quality validation, and removing resilience headroom.

## Verification
Demonstrate lower normalized serving cost while latency, error rate, availability, and quality remain within approved bounds.

## Expected output
A prioritized cost-optimization plan with measured savings, trade-offs, and rollback criteria.

## Stop conditions
Reject savings that breach quality, safety, security, contractual SLOs, or required failure headroom.