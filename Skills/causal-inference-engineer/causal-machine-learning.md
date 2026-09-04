# Causal Machine Learning

## Purpose
Use flexible machine-learning models for nuisance estimation or treatment-effect heterogeneity without sacrificing causal identification, sample splitting, or valid uncertainty.

## When to use
Use when nonlinear confounding, high-dimensional covariates, or heterogeneous effects make simple parametric nuisance models inadequate.

## Inputs
- Treatment, outcome, pre-treatment covariates
- Defined estimand and identification strategy
- Sample size and overlap information
- Candidate ML learners

## Context to inspect
Inspect feature timing, dimensionality, rare treatment strata, leakage, clustering, repeated observations, and whether policy evaluation is needed.

## Core knowledge
ML improves prediction of nuisance functions but does not create identification. Double/debiased ML, R-learners, causal forests, TMLE, and cross-fitted doubly robust estimators separate flexible learning from target-parameter estimation.

## Procedure
1. Define identification assumptions and target estimand before model selection.
2. Restrict features to causally legitimate information.
3. Build simple parametric baselines.
4. Choose nuisance learners based on sample size and data structure.
5. Use cross-fitting or honest sample splitting.
6. Tune models only within training folds.
7. Inspect propensity overlap and nuisance calibration.
8. Estimate the target parameter using orthogonal or doubly robust scores where appropriate.
9. Compute uncertainty with influence-function, bootstrap, or cluster-aware methods compatible with the estimator.
10. Compare estimates across learner classes and fold assignments.
11. For CATE, test held-out calibration and policy value.
12. Document computational and reproducibility controls.

## Decision points
Use flexible learners when nuisance misspecification risk is material. Prefer interpretable models when data are limited, stakes are regulated, or complex ML provides no causal precision gain.

## Common failure patterns
- Outcome leakage into propensity features
- Tuning on the full dataset
- Treating feature importance as causality
- No cross-fitting
- ML hides positivity violations
- Invalid naive standard errors

## Verification
Verify strict fold isolation, temporal legitimacy of features, overlap, nuisance performance, estimator stability, and agreement with simpler baselines.

## Expected output
A cross-fitted causal estimate or CATE model with diagnostics, uncertainty, reproducible configuration, and sensitivity analysis.

## Stop conditions
Stop when ML complexity exceeds data support, leakage cannot be eliminated, or identification remains unsupported.