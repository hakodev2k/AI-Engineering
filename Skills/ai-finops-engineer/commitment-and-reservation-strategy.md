# Commitment and Reservation Strategy

## Purpose
Choose and manage reserved, committed, or contracted AI capacity so discounts are captured without creating expensive stranded commitments.

## When to use
Use when sustained GPU, CPU, managed model, or cloud usage is large enough that commitments can materially change economics.

## Inputs
- Historical usage and forecasts
- Commitment products and terms
- Discount schedules
- Cancellation/exchange rules
- Workload portability
- Budget and risk tolerance

## Context to inspect
Inspect regional demand, accelerator families, utilization stability, planned migrations, provider concentration, application criticality, and existing commitments.

## Core knowledge
Commitments convert variable price risk into utilization risk. The correct target is usually stable baseload, not forecast peak. Flexibility has economic value and must be compared with nominal discounts.

## Procedure
1. Normalize historical usage to comparable resource units.
2. Identify stable baseload by region and resource family.
3. Build downside and upside demand scenarios.
4. Compare effective rates after discounts, credits, and fees.
5. Quantify break-even utilization for each commitment option.
6. Assess workload portability and architecture changes.
7. Reserve only the demand with sufficiently high confidence.
8. Leave uncertain growth on flexible capacity.
9. Track coverage, utilization, expiration, and stranded cost.
10. Rebalance or exchange commitments when permitted.
11. Review new purchases against portfolio-wide exposure.

## Decision points
Choose flexible commitments when model or hardware evolution is likely. Prefer shorter terms when uncertainty is high. Avoid tying experimental demand to long commitments.

## Common failure patterns
Committing to forecast peaks, ignoring region/SKU constraints, buying commitments before workload stabilization, and counting nominal discount as realized savings.

## Verification
Measure commitment utilization, coverage, effective blended rate, and stranded cost against an on-demand counterfactual.

## Expected output
A commitment portfolio plan with quantities, terms, break-even analysis, risk scenarios, and review dates.

## Stop conditions
Stop when contract terms are unclear, demand confidence is insufficient, or the proposed commitment exceeds delegated approval thresholds.