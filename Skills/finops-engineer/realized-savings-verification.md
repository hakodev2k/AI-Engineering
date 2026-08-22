# Realized Savings Verification

## Purpose
Prove whether an optimization actually reduced cost after accounting for demand changes, discounts, migrations, and other confounding factors.

## When to use
Use after rightsizing, cleanup, commitment changes, architecture optimization, contract changes, or any claimed cost-saving initiative.

## Inputs
Pre/post billing, usage drivers, deployment/change dates, forecast, allocation data, pricing, commitments, service quality metrics.

## Context to inspect
Inspect seasonality, traffic changes, price changes, credits, workload migration, partial periods, currency, and whether cost shifted to another service.

## Core knowledge
Opportunity, avoided cost, and realized savings are different. Verification needs a counterfactual baseline: what cost would reasonably have been without the change.

## Procedure
1. Define the saving mechanism before implementation.
2. Capture baseline cost, usage, and unit metrics.
3. Record exact change scope and date.
4. Allow sufficient billing stabilization time.
5. Build an appropriate counterfactual using normalized usage or forecast.
6. Compare actual post-change cost to counterfactual.
7. Check for cost displacement to other services.
8. Verify service quality did not degrade.
9. Classify realized, avoided, or unverified value.
10. Publish evidence and update the optimization portfolio.

## Decision points
Use unit-cost normalization when demand changed materially. Use simple before/after only for stable workloads and pricing.

## Common failure patterns
Annualizing one quiet day, counting deleted resources at list price despite commitments, ignoring shifted network/storage costs, and claiming savings before bills settle.

## Verification
Calculation is reproducible from source data; scope matches the implemented change; confounders are documented; SLOs remain healthy.

## Expected output
A savings evidence record with baseline, counterfactual, actuals, classification, confidence, and quality guardrails.

## Stop conditions
Do not report realized savings when attribution cannot be separated from material demand or pricing changes.