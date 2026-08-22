# Chargeback and Showback

## Purpose
Design transparent cost accountability mechanisms that inform or bill internal consumers without creating misleading incentives or disputes.

## When to use
Use when teams need visibility into owned spend, finance requires internal allocation, or the organization is considering chargeback.

## Inputs
Allocation model, organization hierarchy, shared-cost rules, billing, budgets, finance policy, dispute process, unit metrics.

## Context to inspect
Inspect allocation confidence, shared platforms, discounts, taxes, commitments, organizational incentives, cost-center mapping, and accounting requirements.

## Core knowledge
Showback communicates attributed cost; chargeback posts financial responsibility. Chargeback requires stronger data quality, governance, and dispute handling. Accountability should not discourage shared platforms or necessary reliability.

## Procedure
1. Clarify whether the goal is awareness, budgeting, or accounting transfer.
2. Measure allocation coverage and confidence.
3. Define direct and shared-cost treatment.
4. Agree gross/net/amortized cost basis with finance.
5. Design reports with explainable drill-down.
6. Run showback and resolve data-quality issues first.
7. Define dispute, correction, and exception workflows.
8. Pilot chargeback with willing/high-confidence scopes if required.
9. Monitor behavioral side effects.
10. Reconcile posted amounts to source billing and finance records.

## Decision points
Prefer showback when ownership data or organizational maturity is insufficient. Charge back shared costs only with accepted allocation drivers.

## Common failure patterns
Launching chargeback on weak tags, unexplained shared allocations, retroactive rule changes, treating platform overhead as team waste, and no correction process.

## Verification
Attributed totals reconcile; sampled teams can explain charges; dispute workflow closes issues; finance validates accounting treatment.

## Expected output
A showback/chargeback policy, allocation basis, reporting design, reconciliation, and dispute process.

## Stop conditions
Stop before financial posting when finance approval, allocation confidence, or cost-center mappings are insufficient.