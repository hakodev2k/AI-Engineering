# Missing Data and Selection Bias

## Purpose
Prevent causal estimates from being distorted by missing covariates/outcomes, loss to follow-up, eligibility filters, or conditioning on selected samples.

## When to use
Use whenever inclusion, observation, or missingness depends on variables related to treatment or outcome.

## Inputs
- Analysis cohort definition
- Missingness indicators
- Treatment, outcome, covariates
- Censoring or enrollment process

## Context to inspect
Inspect who enters the dataset, who remains observable, why values are missing, post-treatment selection, survivor bias, and data-pipeline exclusions.

## Core knowledge
Selection can create collider bias. Missing completely at random, missing at random, and missing not at random imply different strategies. Inverse probability of censoring/selection weights, multiple imputation, g-methods, and sensitivity analysis are common tools.

## Procedure
1. Draw the source population, eligibility, treatment, observation, and outcome timeline.
2. Quantify missingness and attrition by treatment and important covariates.
3. Model the causal causes of selection/missingness rather than choosing a method mechanically.
4. Avoid complete-case analysis unless its assumptions are defensible.
5. Use multiple imputation for appropriate missing covariates, preserving treatment/outcome structure.
6. Use censoring or selection weights when observation is conditionally ignorable.
7. Inspect weight distributions and effective sample size.
8. Account for uncertainty introduced by imputation or weighting.
9. Compare estimates across complete-case, weighted, imputed, and bounded analyses.
10. Run sensitivity analyses for nonignorable missingness where plausible.
11. State the population represented after selection adjustments.

## Decision points
Prefer design fixes and improved data capture over statistical correction when possible. Use weighting for selection mechanisms and imputation for missing values only when their assumptions match the causal process.

## Common failure patterns
- Complete-case analysis by default
- Conditioning on post-treatment survival or engagement
- Imputing without temporal constraints
- Ignoring differential attrition
- Extreme censoring weights

## Verification
Verify missingness patterns, selection models, weight stability, imputation diagnostics, and robustness of the causal conclusion.

## Expected output
A selection/missingness analysis with corrected estimates, diagnostics, assumptions, and sensitivity bounds.

## Stop conditions
Stop when observation depends on unmeasured causes strongly enough that no credible correction or bound supports the requested claim.