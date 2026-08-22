# Cost Architecture and FinOps

## Purpose
Make cost an explicit architecture quality attribute and design workloads whose spending is understandable, attributable, and aligned with business value.

## When to use
Use during cloud/service selection, scaling design, data architecture, AI/data workloads, and cost optimization.

## Inputs
Usage forecasts, pricing models, architecture, SLOs, budgets, unit economics, growth scenarios.

## Preconditions
Major workload drivers and business value metrics are known.

## Context to inspect
Compute, storage, network egress, managed-service pricing, licenses, reservations/savings plans, idle resources, telemetry cost, backup/DR cost.

## Core knowledge
Optimize unit economics, not only monthly totals. Lower cost can reduce resilience or performance; architecture must expose those trade-offs.

## Procedure
1. Define cost ownership and tagging/allocation model.
2. Identify primary cost drivers.
3. Calculate cost per meaningful business/workload unit.
4. Model normal, peak, and growth scenarios.
5. Compare service options including operational labor.
6. Identify idle, overprovisioned, or high-egress patterns.
7. Evaluate commitments only for stable demand.
8. Set budgets and anomaly alerts.
9. Define cost guardrails for autoscaling and data retention.
10. Review cost alongside SLO and capacity metrics.

## Decision points
Prefer predictable managed services when labor savings justify premium. Use reserved capacity only where utilization confidence is high.

## Common failure patterns
Optimizing list price only, ignoring egress, no cost ownership, over-reserving, deleting resilience to save money without risk acceptance.

## Verification
Forecast and actual spend can be attributed and explained through workload metrics.

## Expected output
Cost model, guardrails, and architecture trade-offs tied to business value.

## Stop conditions
Stop when finance or workload assumptions are too incomplete to produce credible economics.