# Cost and Investment Decisions

## Purpose
Make engineering investment decisions using total cost, opportunity cost, risk, and strategic value rather than infrastructure price or implementation effort alone.

## When to use
Use for build-versus-buy decisions, cloud spend, platform investments, vendor choices, migrations, staffing proposals, and major optimization work.

## Inputs
Current costs, usage, forecasts, engineering effort, vendor pricing, operational burden, risk, switching cost, roadmap, and business value.

## Context to inspect
Inspect hidden labor, support, compliance, reliability, migration, lock-in, data-egress, licensing, and decommissioning costs.

## Core knowledge
Total cost of ownership includes people and risk. Cheapest unit price may be expensive operationally. Investment decisions should model ranges and uncertainty rather than fabricate exact ROI.

## Procedure
1. Define the outcome the investment should create.
2. Establish the current baseline cost and pain.
3. Identify realistic alternatives, including doing nothing.
4. Estimate implementation, recurring, operational, migration, and exit costs.
5. Model benefits and avoided risks with explicit assumptions.
6. Consider reversibility, lock-in, and strategic capability.
7. Compare scenarios over a relevant time horizon.
8. Run sensitivity analysis on uncertain assumptions.
9. Recommend an option with trade-offs and decision triggers.
10. Measure realized cost and benefit after implementation.

## Decision points
Build when differentiation, control, or long-term economics justify ownership; buy when a commodity capability can be obtained with acceptable risk and integration cost.

## Common failure patterns
Ignoring engineer time, sunk-cost reasoning, optimizing small cloud bills while ignoring labor, unrealistic utilization forecasts, and no exit-cost analysis.

## Verification
Verify cost inputs have sources, uncertainty is visible, alternatives are comparable, material risks are included, and post-investment measurement is defined.

## Expected output
A decision model with options, total-cost ranges, benefits, risks, assumptions, and recommendation.

## Stop conditions
Escalate when financial authority is exceeded, contractual terms are unavailable, or the decision creates material legal, security, or compliance exposure.