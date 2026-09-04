# Propensity Score Methods

## Purpose
Use propensity scores for design and adjustment while controlling bias from poor overlap, misspecification, and inappropriate covariate selection.

## When to use
Use for observational treatment comparisons when conditional exchangeability is plausible and treatment assignment can be modeled from pre-treatment covariates.

## Inputs
- Treatment indicator
- Pre-treatment confounders
- Target estimand
- Outcome and sample definition

## Context to inspect
Inspect treatment prevalence, overlap, rare strata, deterministic treatment rules, missing covariates, and temporal validity of predictors.

## Core knowledge
Propensity scores support matching, stratification, inverse probability weighting, overlap weighting, and covariate balancing. Balance and overlap matter more than propensity-model discrimination.

## Procedure
1. Define the estimand: ATE, ATT, overlap population, or another target.
2. Include causes of treatment/outcome that are measured pre-treatment.
3. Exclude post-treatment variables and instruments used only to predict treatment unless justified.
4. Fit a transparent baseline propensity model.
5. Plot propensity distributions by treatment group.
6. Quantify overlap and effective sample size.
7. Select matching or weighting consistent with the estimand.
8. Examine standardized mean differences after adjustment.
9. Trim or redefine the target population when positivity is untenable.
10. Estimate effects with uncertainty that reflects the chosen design.
11. Compare against alternate propensity specifications.
12. Run sensitivity analysis for residual confounding.

## Decision points
Use matching when a comparable treated/control cohort is operationally useful; weighting when population-standardized effects are required; overlap weighting when extremes create instability and the overlap population is scientifically meaningful.

## Common failure patterns
- Optimizing propensity AUC instead of balance
- Extreme inverse weights
- Hidden target-population changes after trimming
- Matching after looking at outcomes
- Using post-treatment covariates

## Verification
Verify covariate balance, overlap, effective sample size, weight distribution, target estimand, and robustness to alternate specifications.

## Expected output
Adjusted cohort or weights, balance report, effect estimate, assumptions, and sensitivity results.

## Stop conditions
Stop when overlap is structurally absent or important confounders are unavailable.