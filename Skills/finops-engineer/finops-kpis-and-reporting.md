# FinOps KPIs and Reporting

## Purpose
Design reporting that drives accountable cost decisions rather than producing dashboards with disconnected vanity metrics.

## When to use
Use when establishing FinOps reporting, executive reviews, engineering scorecards, or optimization programs.

## Inputs
Billing, allocation data, budgets, forecasts, commitments, optimization actions, unit metrics, ownership, service quality metrics.

## Context to inspect
Inspect audience decisions, data latency, allocation confidence, forecast cadence, savings definitions, commitment coverage/utilization, and business KPIs.

## Core knowledge
Metrics should connect spend to outcomes and actions. Distinguish realized savings, avoided cost, negotiated savings, and theoretical opportunity. Pair efficiency metrics with reliability and growth.

## Procedure
1. Identify each audience and decisions they own.
2. Select a minimal metric set tied to those decisions.
3. Define formulas, scope, source, freshness, and owner.
4. Separate actuals, forecast, budget, opportunity, and realized results.
5. Include allocation coverage and unknown spend.
6. Add unit economics where meaningful.
7. Show trends and variance drivers, not only totals.
8. Attach actions and owners to material exceptions.
9. Validate dashboard totals against billing.
10. Retire metrics that do not change decisions.

## Decision points
Executives need business-level trends and risk; engineering needs actionable resource/service drivers. Avoid one dashboard for every audience.

## Common failure patterns
Counting recommendations as savings, mixing gross and net costs, hiding unallocated spend, ranking teams by raw spend, and reporting percentages without denominators.

## Verification
Metrics reproduce from source data; stakeholders interpret definitions consistently; reported savings reconcile to bills; exceptions produce owned actions.

## Expected output
A KPI dictionary, audience-specific reporting views, reconciliation checks, and action workflow.

## Stop conditions
Stop when metric definitions or accounting boundaries are disputed and would materially change reported outcomes.