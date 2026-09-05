# Cost and Capacity Trade-off Analysis

## Purpose
Evaluate capacity options using usable performance, reliability, flexibility, and lifecycle cost rather than unit price alone.

## When to use
Use for hardware purchases, cloud reservations, model-routing changes, overprovisioning reviews, or budget-constrained growth.

## Inputs
Capacity demand, benchmark results, hardware/cloud pricing, utilization, reservation terms, power, support cost, migration effort, SLOs.

## Preconditions
Costs and usable-capacity metrics are expressed over the same planning horizon.

## Context to inspect
On-demand versus reserved capacity, depreciation, cloud egress, software licensing, datacenter overhead, operational complexity, expected hardware lifetime.

## Core knowledge
Lowest nominal cost can create higher total cost through poor utilization, extra replicas, migration effort, or inflexibility. Senior planning values optionality when demand or model architecture is uncertain.

## Procedure
1. Define feasible capacity options.
2. Convert each option to usable SLO-compliant capacity.
3. Calculate fixed and variable cost over the planning horizon.
4. Include reserve and failure capacity.
5. Include migration and operational overhead.
6. Model low, expected, and high demand.
7. Calculate break-even points.
8. Evaluate lock-in and exit risk.
9. Recommend a portfolio aligned with forecast confidence.

## Decision points
Commit long term for stable base demand; keep elastic capacity for uncertainty. Do not sacrifice critical reliability or quality solely for lower cost.

## Common failure patterns
Comparing raw GPU hourly prices, assuming full utilization, ignoring reservation waste, and excluding staffing or migration cost.

## Verification
Sensitivity analysis shows whether the recommendation remains reasonable under plausible demand and price changes.

## Expected output
A cost-capacity decision model with break-even points, risks, and recommended mix.

## Stop conditions
Escalate when financial assumptions or contractual terms are unavailable or disputed.