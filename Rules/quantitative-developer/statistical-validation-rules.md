# Statistical Validation Rules

## Purpose
Require statistical claims to survive appropriate uncertainty, dependence, and selection controls.

## Scope
Applies to hypotheses, forecasts, signals, factor studies, model comparisons, and performance attribution.

## MUST
- Statistical tests MUST match the data-generating assumptions or explicitly use robust alternatives.
- Dependence, heteroskedasticity, non-stationarity, and multiple testing MUST be considered when material.
- Reported effects MUST include magnitude and uncertainty, not only significance thresholds.
- Sample size and effective independent observations MUST be assessed before strong conclusions are made.
- Hyperparameter and feature selection MUST be included in the interpretation of validation evidence.

## MUST NOT
- P-values MUST NOT be interpreted as probability that a hypothesis is true.
- Repeated testing MUST NOT be presented as a single pre-specified experiment.
- Statistical significance MUST NOT substitute for economic or operational significance.

## SHOULD
- Prefer confidence intervals, stability analysis, resampling, and robust estimators where appropriate.
- Predefine primary metrics for consequential experiments.

## Exceptions
Alternative methods require documented assumptions, rationale, known limitations, and independent review when conclusions affect production capital or risk.

## Verification
Review notebooks or code, test definitions, sample construction, correction methods, uncertainty estimates, robustness checks, and experiment history. Recompute key statistics independently where feasible.