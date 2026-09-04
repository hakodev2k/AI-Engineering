# Multi-Cloud AI Cost Comparison

## Purpose
Compare AI workload economics across cloud providers, managed model APIs, and self-hosted options using equivalent workload assumptions rather than headline list prices.

## When to use
Use for provider selection, repatriation, migration, capacity sourcing, or negotiating contracts for training and inference workloads.

## Inputs
- Workload throughput benchmarks
- Provider pricing and discounts
- Network/egress costs
- Storage and managed-service costs
- Availability and quota constraints
- Operational staffing assumptions
- Reliability and compliance requirements

## Context to inspect
Inspect accelerator generations, regional availability, managed-service features, data gravity, model portability, deployment tooling, observability, support, and contract terms.

## Core knowledge
Cross-provider comparisons must normalize useful output, not nominal instance size. Total cost includes accelerator efficiency, idle capacity, egress, support, engineering toil, and migration risk. Cheap compute can be uneconomic if data movement or operational complexity dominates.

## Procedure
1. Define a representative workload and success metrics.
2. Benchmark or obtain credible throughput on candidate platforms.
3. Normalize cost to useful units such as tokens, samples, or successful requests.
4. Include storage, network, platform, and support costs.
5. Apply realistic discounts and commitments separately from list price.
6. Model required headroom and expected utilization.
7. Quantify migration and dual-running cost.
8. Evaluate quota, availability, compliance, and reliability constraints.
9. Estimate ongoing operational effort.
10. Run low/base/high demand scenarios.
11. Perform a pilot when the decision is material.
12. Document switching costs and lock-in risks.

## Decision points
Prefer the economically superior platform only when operational and compliance requirements remain satisfied. Use multi-cloud only when resilience, scarcity, or bargaining benefits justify duplicated complexity.

## Common failure patterns
Comparing instance hourly rates only, ignoring egress, assuming identical throughput across hardware, and understating migration effort.

## Verification
Validate cost assumptions against pilot billing and measured throughput. Confirm non-cost requirements through architecture and operational review.

## Expected output
A normalized provider comparison, total-cost model, sensitivity analysis, risks, and sourcing recommendation.

## Stop conditions
Stop when benchmarks are not comparable, pricing terms are confidential or unavailable, or compliance/availability constraints invalidate a candidate before economic comparison.