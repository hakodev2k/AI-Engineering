# Quality, Latency, and Cost Routing Policy

## Purpose
Design routing logic that balances output quality, response latency, and inference cost without violating hard workload constraints.

## When to use
Use when several eligible models can satisfy the same request but differ materially in quality, speed, or price.

## Inputs
Workload classes, model evaluation scores, latency distributions, token pricing, traffic volume, budget targets, fallback rules, and hard eligibility constraints.

## Preconditions
Quality and latency measurements must represent the target workload rather than generic benchmarks.

## Context to inspect
Current routing weights, model registry, provider quotas, token distributions, cache behavior, tenant tiers, and production route attribution.

## Core knowledge
The cheapest or fastest model is not necessarily the lowest-cost system choice if retries, failures, long outputs, or downstream correction increase total cost. Weighted scores are useful only when objective scales and constraints are understood. Pareto-efficient choices often provide a clearer decision surface than arbitrary composite scores.

## Procedure
1. Filter out models that fail hard eligibility rules.
2. Normalize comparable workload-specific quality, latency, and cost metrics.
3. Identify minimum acceptable quality.
4. Identify latency and spend ceilings.
5. Compute candidate trade-off frontiers.
6. Choose policy behavior by request class and tenant tier.
7. Define tie-breaking and deterministic behavior.
8. Add safeguards against routing oscillation.
9. Test policy under realistic traffic and token distributions.
10. Roll out gradually and observe quality, latency, and cost together.

## Decision points
Use rules when requirements are stable and explainability matters. Use dynamic optimization when traffic and capacity change significantly. Never allow soft cost optimization to bypass safety, residency, or authorization constraints.

## Common failure patterns
Optimizing on model list price alone, using average latency, comparing evaluation scores from different datasets, and changing several routing objectives simultaneously without attribution.

## Verification
Replay representative traffic and confirm the chosen routes satisfy minimum quality and SLOs while meeting expected cost bounds.

## Expected output
A documented routing policy, objective hierarchy, simulation results, rollout plan, and measurable guardrails.

## Stop conditions
Stop when quality metrics are not comparable, cost data is incomplete, or the policy cannot explain why high-risk requests choose a given model.