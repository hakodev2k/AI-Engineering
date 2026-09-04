# Time-Varying Treatment

## Purpose
Estimate causal effects when treatment, confounders, and outcomes evolve over time and prior treatment changes future confounders.

## When to use
Use for longitudinal interventions, repeated exposures, adherence, dynamic treatment regimes, or policy histories.

## Inputs
- Longitudinal unit-time data
- Treatment history
- Time-varying covariates
- Outcome and censoring history
- Target regime/estimand

## Context to inspect
Inspect observation cadence, treatment-confounder feedback, censoring, loss to follow-up, immortal-time risk, and alignment of decision times.

## Core knowledge
Standard regression can be biased when time-varying confounders are affected by prior treatment. Marginal structural models, inverse probability weights, g-formula, and sequential doubly robust methods address this under sequential exchangeability and positivity.

## Procedure
1. Define time zero, decision intervals, treatment history, and outcome horizon.
2. Draw the longitudinal causal structure.
3. Identify confounders affected by prior treatment.
4. Define static or dynamic treatment regimes.
5. Estimate treatment and censoring probabilities at each time.
6. Construct stabilized longitudinal weights and inspect their distribution.
7. Fit a marginal structural or g-formula estimator.
8. Use robust uncertainty accounting for repeated observations.
9. Truncate extreme weights only with explicit estimand implications.
10. Compare with alternative longitudinal estimators.
11. Run sensitivity analyses for unmeasured time-varying confounding.

## Decision points
Prefer g-formula when outcome dynamics are easier to model; weighting when treatment assignment models are more credible; doubly robust sequential estimators when both can be estimated flexibly.

## Common failure patterns
- Conditioning directly on treatment-induced confounders
- Immortal-time bias
- Misaligned treatment/outcome windows
- Extreme longitudinal weights
- Ignoring informative censoring

## Verification
Verify temporal ordering, sequential positivity, weight stability, censoring handling, regime definition, and robustness across estimators.

## Expected output
Longitudinal causal estimate with regime definition, diagnostics, uncertainty, and sensitivity analysis.

## Stop conditions
Stop when treatment/covariate history cannot be reconstructed reliably or sequential support is absent.