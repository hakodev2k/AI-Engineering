# Regression Discontinuity

## Purpose
Estimate local causal effects when treatment assignment changes at a known threshold of a running variable.

## When to use
Use when eligibility or treatment probability changes sharply at a cutoff and units cannot precisely manipulate assignment around that cutoff.

## Inputs
- Running variable and cutoff
- Treatment assignment rule
- Outcome
- Covariates and assignment metadata

## Context to inspect
Inspect manipulation incentives, heaping, multiple cutoffs, fuzzy compliance, bandwidth support, and treatment changes near the threshold.

## Core knowledge
Sharp and fuzzy RDD identify local effects under continuity assumptions. Inference depends on bandwidth, polynomial order, kernel choice, bias correction, and sufficient observations near the cutoff.

## Procedure
1. Confirm the cutoff existed before outcome realization.
2. Plot treatment probability and outcome against the running variable.
3. Check density around the threshold for manipulation.
4. Check continuity of pre-treatment covariates.
5. Choose sharp or fuzzy RDD based on compliance.
6. Use local polynomial estimation with defensible bandwidth selection.
7. Prefer low-order local polynomials over high-order global fits.
8. Estimate bias-corrected confidence intervals where appropriate.
9. Test alternate bandwidths and kernels.
10. Run placebo cutoffs and unaffected outcomes.
11. Interpret the effect as local to units near the threshold.

## Decision points
Use fuzzy RDD when the cutoff changes treatment probability rather than deterministically assigning treatment. Avoid extrapolating local effects without external evidence.

## Common failure patterns
- High-degree global polynomial fits
- Ignoring sorting near the threshold
- Selecting bandwidth after seeing the desired result
- Treating a local effect as global
- Ignoring co-occurring policy discontinuities

## Verification
Verify assignment discontinuity, density continuity, covariate continuity, bandwidth robustness, placebo tests, and local interpretation.

## Expected output
RDD effect estimate, diagnostic plots, robustness results, and a clear statement of the local target population.

## Stop conditions
Stop when assignment can be precisely manipulated, another intervention changes at the same cutoff, or support near the threshold is inadequate.