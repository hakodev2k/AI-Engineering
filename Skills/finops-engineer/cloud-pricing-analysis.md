# Cloud Pricing Analysis

## Purpose
Compare cloud pricing options using effective workload cost rather than headline rates, including dimensions that materially affect total cost.

## When to use
Use for service selection, architecture options, region choices, migrations, provider comparisons, or pricing-model changes.

## Inputs
Workload profile, provider price sheets/calculators, discounts, commitments, storage/network patterns, support/licensing costs, growth assumptions.

## Context to inspect
Inspect billing units, minimum charges, request fees, data transfer, regional differences, tiered pricing, free allowances, licenses, support, taxes, and commitment eligibility.

## Core knowledge
Cloud pricing is multidimensional and frequently nonlinear. Effective cost depends on workload shape. List-price comparisons without usage modeling are unreliable.

## Procedure
1. Define workload requirements and measurable consumption profile.
2. Identify all billable dimensions for each option.
3. Normalize units and time period.
4. Apply realistic usage distribution, not only averages.
5. Include network, storage, operations, licenses, and support where material.
6. Model existing and potential discounts separately.
7. Add growth and downside scenarios.
8. Identify pricing cliffs, minimums, and lock-in.
9. Compare total and unit cost alongside technical constraints.
10. Validate model against a sample bill or controlled workload where possible.

## Decision points
Choose the technically suitable option with best risk-adjusted economics, not necessarily lowest modeled bill. Treat uncertain discounts separately from guaranteed rates.

## Common failure patterns
Comparing incompatible units, ignoring egress, assuming 100% utilization, mixing currencies/tax bases, and applying commitment discounts to ineligible usage.

## Verification
Calculations reproduce; billable dimensions match provider terms; sample usage reconciles within expected tolerance; assumptions are explicit.

## Expected output
A pricing model with scenarios, assumptions, effective unit costs, risks, and recommendation.

## Stop conditions
Stop when current provider pricing terms, contractual discounts, or workload requirements cannot be established reliably.