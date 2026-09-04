# Heterogeneous Treatment Effects

## Purpose
Estimate how causal effects vary across people, segments, contexts, or covariate profiles without confusing predictive heterogeneity with causal heterogeneity.

## When to use
Use when treatment allocation, targeting, policy personalization, or subgroup safety depends on variation in treatment effect.

## Inputs
- Treatment, outcome, pre-treatment covariates
- Target population and base estimand
- Sample size and overlap diagnostics

## Context to inspect
Inspect subgroup sizes, overlap by segment, multiple testing, treatment prevalence, covariate measurement timing, and whether heterogeneity hypotheses were prespecified.

## Core knowledge
CATE estimation can use interactions, causal forests, meta-learners, R-learners, doubly robust learners, or Bayesian models. Flexible models require honest splitting/cross-fitting and policy-level evaluation.

## Procedure
1. Confirm the average effect identification strategy first.
2. Define prespecified effect modifiers where domain knowledge exists.
3. Assess treatment overlap within important subgroups.
4. Establish a simple interaction baseline.
5. Use flexible CATE models only with sufficient sample size and regularization.
6. Apply honest splitting or cross-fitting.
7. Rank units by predicted treatment effect and assess calibration by groups.
8. Estimate subgroup effects with valid uncertainty.
9. Correct or control for multiplicity when testing many subgroups.
10. Evaluate any treatment policy induced by CATE estimates on held-out data.
11. Examine stability across seeds, folds, estimators, and time periods.
12. Communicate where heterogeneity evidence is exploratory.

## Decision points
Prefer interpretable subgroup models for small samples or regulated decisions. Use flexible causal ML when data are rich and targeting value justifies complexity.

## Common failure patterns
- Searching many subgroups and reporting only winners
- Using post-treatment features
- No overlap within segments
- Treating predicted outcome risk as treatment effect
- Deploying individualized decisions from unstable CATEs

## Verification
Verify held-out calibration, subgroup overlap, confidence intervals, multiplicity handling, stability, and incremental policy value over simpler targeting rules.

## Expected output
CATE or subgroup-effect estimates, diagnostics, uncertainty, and policy implications.

## Stop conditions
Stop when subgroup support is inadequate, heterogeneity is not stable out of sample, or deployment would exceed evidence quality.