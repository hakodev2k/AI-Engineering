# AI Budgeting and Forecasting

## Purpose
Build rolling budgets and forecasts for AI workloads that reflect usage growth, model changes, training events, price changes, and infrastructure commitments.

## When to use
Use for quarterly planning, launch forecasts, annual budgets, or when AI spend is volatile enough that static budgets are misleading.

## Inputs
- Historical spend and usage
- Product traffic forecasts
- Training roadmap
- Model/provider roadmap
- Pricing and commitment terms
- Planned architecture changes

## Context to inspect
Inspect workload ownership, model mix, token growth, retraining cadence, GPU fleet changes, data growth, vendor contracts, and one-time migration costs.

## Core knowledge
AI cost forecasts should be driver-based. Spend should be linked to controllable quantities such as tokens, accelerator-hours, requests, storage volume, and experiment count rather than extrapolated from last month alone.

## Procedure
1. Define forecast horizon and ownership boundaries.
2. Separate recurring, usage-variable, and one-time costs.
3. Identify primary cost drivers for each workload.
4. Build low/base/high demand scenarios.
5. Incorporate known training and launch events.
6. Apply expected pricing, discounts, and commitments.
7. Model architecture changes separately from organic growth.
8. Assign uncertainty ranges to weak assumptions.
9. Compare forecast against budget and identify gap drivers.
10. Define corrective actions before budget breach.
11. Reforecast monthly using actual usage and revised assumptions.
12. Explain variance by driver, not only dollar amount.

## Decision points
Use shorter forecast cycles for fast-changing AI products. Maintain scenario ranges when model/provider strategy is unsettled. Distinguish committed spend from discretionary spend.

## Common failure patterns
Linear extrapolation of bursty training spend, ignoring token-length growth, double-counting savings plans, and hiding experimental demand inside production forecasts.

## Verification
Back-test prior forecasts and calculate error by major cost driver. Confirm budget totals reconcile with finance-approved views.

## Expected output
A rolling AI cost forecast with scenarios, driver assumptions, variance explanations, and corrective actions.

## Stop conditions
Stop when critical demand inputs are unavailable, contractual pricing is unknown, or finance policy requires assumptions that have not been approved.