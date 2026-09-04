# Migration Cost and TCO Modeling

## Purpose
Estimate migration and steady-state cloud economics with enough rigor to support treatment, sizing, and sequencing decisions.

## When to use
Use during business-case development, migration strategy selection, target sizing, and post-migration optimization.

## Inputs
Current infrastructure and license cost, utilization, target pricing, data transfer, managed services, support, labor, migration tooling, commitments, growth, and decommission timelines.

## Preconditions
Cost scope and comparison period must be explicit. Avoid comparing cloud variable cost with incomplete legacy cost.

## Context to inspect
Inspect compute, storage, IOPS, backup, network egress, inter-zone/region traffic, licenses, support plans, observability, security services, migration overlap, reserved/committed pricing, and labor.

## Core knowledge
TCO includes transition overlap and operational labor, not only cloud list prices. Architecture choices can move cost between compute, network, storage, managed services, and engineering effort.

## Procedure
1. Define comparison horizon and cost categories.
2. Establish current run-rate and allocation confidence.
3. Model target consumption from measured demand.
4. Include HA, backup, logging, security, support, and network charges.
5. Estimate migration labor, tooling, temporary connectivity, and dual-running cost.
6. Model licensing changes and exit costs.
7. Build base, high, and low scenarios for uncertain drivers.
8. Compare migration treatments using both transition and steady-state economics.
9. Identify commitment opportunities only after demand confidence is sufficient.
10. Define cost tags/budgets before migration.
11. Compare actual spend to model after each wave.
12. Update assumptions and feed variance into future waves.

## Decision points
Use commitments for stable, predictable demand; preserve on-demand flexibility during uncertain migration phases. Prefer managed services when operational value offsets premium. Consider data gravity before architectures that create recurring transfer charges.

## Common failure patterns
Using list-price calculators without utilization data; ignoring dual-run cost; excluding egress/logging; counting sunk cost inconsistently; buying commitments before sizing stabilizes; treating labor as free.

## Verification
Reconcile model categories with actual billing after pilot/waves. Explain material variance and update forecasts. Ensure cost allocation reaches accountable owners.

## Expected output
A transparent TCO model with assumptions, scenarios, migration overlap, steady-state forecast, and variance tracking.

## Stop conditions
Escalate when major cost drivers lack data, licensing terms are unknown, or financial conclusions depend on unsupported utilization assumptions.