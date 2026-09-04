# Synthetic Control

## Purpose
Construct a weighted counterfactual for an aggregate treated unit or small treated set when conventional parallel-trends comparisons are weak.

## When to use
Use for region, market, organization, platform, or policy interventions with long pre-treatment histories and a donor pool of untreated units.

## Inputs
- Treated unit and intervention date
- Donor pool
- Pre-treatment outcomes and predictors
- Post-treatment outcomes

## Context to inspect
Inspect donor contamination, anticipation, structural breaks, outcome comparability, pre-period length, and whether treated-unit characteristics lie within donor support.

## Core knowledge
Synthetic control balances pre-treatment outcomes/predictors using convex or regularized weights. Credibility depends heavily on pre-treatment fit and placebo comparisons.

## Procedure
1. Define treated unit, treatment date, and estimand.
2. Exclude contaminated or structurally incomparable donors.
3. Choose pre-treatment predictors without post-treatment leakage.
4. Fit weights using only pre-treatment information.
5. Quantify pre-treatment fit and inspect residual patterns.
6. Estimate post-treatment gaps.
7. Run in-space placebo treatments for donor units.
8. Run in-time placebo intervention dates.
9. Compare alternative predictor windows and donor pools.
10. Inspect weight concentration and extrapolation risk.
11. Report effect paths rather than only a single average when dynamics matter.

## Decision points
Prefer synthetic control when one/few aggregate units are treated and pre-period fit can be strong. Prefer DiD when many treated units support cohort-based estimation.

## Common failure patterns
- Poor pre-treatment fit ignored
- Donor units affected by the intervention
- Hand-picked donor pool after seeing results
- Overinterpreting noisy post-treatment gaps
- No placebo distribution

## Verification
Verify donor eligibility, pre-treatment fit, weight stability, placebo comparisons, and robustness across reasonable donor/predictor choices.

## Expected output
Synthetic-control weights, fit diagnostics, treatment-gap series, placebo evidence, and limitations.

## Stop conditions
Stop when no donor combination reproduces the pre-treatment trajectory or donor contamination cannot be ruled out.