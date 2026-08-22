# Commitment Discount Management

## Purpose
Evaluate and manage cloud commitment instruments so discounts are captured without creating excessive lock-in or stranded commitments.

## When to use
Use before purchasing or renewing reservations, savings plans, committed-use discounts, or equivalent provider contracts.

## Inputs
Eligible usage, historical utilization, growth forecast, architecture roadmap, pricing terms, existing commitments, risk tolerance.

## Context to inspect
Inspect commitment scope, term, payment option, flexibility, instance/service eligibility, sharing rules, utilization, coverage, break-even, and migration plans.

## Core knowledge
High coverage is not automatically optimal. Commitment decisions trade discount against demand uncertainty, architecture flexibility, provider concentration, and cash flow.

## Procedure
1. Inventory existing commitments and effective utilization.
2. Establish stable eligible baseline usage.
3. Remove workloads likely to migrate, retire, or materially change.
4. Model demand scenarios over the commitment term.
5. Compare on-demand baseline with commitment alternatives.
6. Calculate break-even and downside under underutilization.
7. Layer purchases instead of committing all forecast demand at once when uncertainty is material.
8. Define utilization and coverage targets.
9. Monitor drift and upcoming expirations.
10. Rebalance or modify commitments where provider terms permit.

## Decision points
Commit only the durable floor when uncertainty is high. Favor flexible instruments when workload shape may change even if headline discount is lower.

## Common failure patterns
Buying to maximize coverage, using last month's peak as baseline, ignoring planned migrations, comparing list prices instead of effective rates, and failing to monitor expiration.

## Verification
Savings model reproduces from billing data; downside scenarios are documented; post-purchase utilization and realized savings meet approved thresholds.

## Expected output
A commitment recommendation with amount, term, risk scenarios, expected savings, monitoring plan, and approval evidence.

## Stop conditions
Stop before purchase when contract authority is missing, material architecture changes are unresolved, or provider terms cannot be verified.