# Unmeasured Confounding Sensitivity

## Purpose
Quantify how strong hidden confounding would need to be to materially change a causal conclusion.

## When to use
Use for observational causal estimates whenever exchangeability depends on measured covariates.

## Inputs
- Main causal estimate and uncertainty
- Adjustment set
- Outcome/treatment scales
- Plausible omitted-confounder strength

## Context to inspect
Inspect known unavailable variables, proxy quality, domain literature, residual imbalance, selection, and whether bias direction can be reasoned about.

## Core knowledge
Sensitivity methods do not prove absence of confounding. They translate assumptions into robustness metrics or bias-adjusted ranges. Applicable tools include E-values, Rosenbaum bounds, partial-R2 robustness values, bias functions, and negative-control approaches.

## Procedure
1. List plausible omitted confounders and their expected relationships with treatment and outcome.
2. Choose a sensitivity framework compatible with the estimator and effect scale.
3. Calculate a robustness metric for the point estimate and confidence limit.
4. Benchmark hidden-confounder strength against measured strong confounders.
5. Explore bias directions rather than only worst-case magnitudes.
6. Recompute conclusions over a grid of plausible sensitivity parameters.
7. Distinguish effect attenuation, sign reversal, and loss of statistical precision.
8. Pair numerical sensitivity with negative controls when possible.
9. State which assumptions remain outside the chosen sensitivity model.
10. Reframe conclusions if plausible confounding can erase the effect.

## Decision points
Use simple robustness metrics for communication and richer bias-function analyses when policy stakes are high or omitted variables are well characterized.

## Common failure patterns
- Reporting a single sensitivity number without benchmarks
- Treating robustness as proof of causality
- Ignoring selection or measurement bias
- Choosing only favorable sensitivity ranges

## Verification
Verify calculations against the effect scale, benchmark parameters against observed covariates, and confirm conclusions across plausible parameter ranges.

## Expected output
A sensitivity report describing robustness thresholds, plausible hidden-bias scenarios, and the conclusion under each scenario.

## Stop conditions
Stop strong causal claims when realistic omitted confounding can reverse or null the decision-relevant conclusion.