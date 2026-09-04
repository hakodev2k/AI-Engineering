# Doubly Robust Estimation

## Purpose
Estimate causal effects using outcome and treatment models so consistency can be retained when one nuisance model is correctly specified, subject to identification assumptions.

## When to use
Use for observational ATE/ATT estimation when flexible nuisance modeling is valuable and overlap is adequate.

## Inputs
- Treatment, outcome, pre-treatment covariates
- Target estimand
- Sample weights or clustering information

## Context to inspect
Inspect positivity, nuisance-model complexity, sample size, treatment prevalence, censoring, and whether cross-fitting is needed.

## Core knowledge
Augmented inverse probability weighting and targeted estimators combine propensity and outcome regression. Double robustness does not protect against unmeasured confounding, positivity failure, data leakage, or both nuisance models being wrong.

## Procedure
1. Confirm identification and estimand.
2. Define treatment and outcome nuisance models using only legitimate covariates.
3. Use cross-fitting when flexible ML risks overfitting.
4. Estimate propensity scores and inspect overlap.
5. Estimate conditional outcomes by treatment.
6. Construct the doubly robust score for the target estimand.
7. Aggregate scores with appropriate weights.
8. Compute robust or influence-function-based uncertainty.
9. Diagnose extreme influence values and nuisance residuals.
10. Compare with simple regression and weighting estimates.
11. Run alternate nuisance specifications and sensitivity analyses.

## Decision points
Prefer cross-fitted semiparametric estimators when nuisance models are flexible. Prefer simpler parametric models when sample size is small and assumptions are defensible.

## Common failure patterns
- Calling an estimate causal without identification
- No cross-fitting with highly adaptive models
- Extreme propensity scores dominate the score
- Incorrect uncertainty after clustering
- Treating double robustness as protection from hidden confounding

## Verification
Verify overlap, nuisance diagnostics, influence-score stability, cross-fitting separation, uncertainty calculation, and agreement with plausible alternative estimators.

## Expected output
Effect estimate, confidence interval, nuisance diagnostics, overlap report, and robustness comparison.

## Stop conditions
Stop when positivity is severe, identification assumptions fail, or nuisance estimation is unstable beyond credible repair.