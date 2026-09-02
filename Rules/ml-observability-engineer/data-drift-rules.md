# Data Drift Monitoring

## Purpose
Detect material changes in production input distributions before they silently degrade model behavior.

## Scope
Applies to model inputs, derived features, cohorts, and reference populations used for drift comparison.

## MUST
- Drift detection MUST define the reference population, comparison window, metric, threshold rationale, and monitored features or representations.
- High-impact features MUST be monitored separately when aggregate drift can conceal local changes.
- Drift alerts MUST be interpreted with sample size and seasonality or known population changes where relevant.
- Material drift MUST trigger an investigation path tied to model quality evidence.

## MUST NOT
- MUST NOT treat statistical drift alone as proof of model degradation.
- MUST NOT use arbitrary thresholds without documenting expected false-positive and false-negative trade-offs.
- MUST NOT silently reset baselines after drift is observed.

## SHOULD
- Combine univariate and multivariate evidence when model behavior depends on interactions.
- Maintain cohort-specific references for materially different populations.

## Exceptions
Baseline or feature exclusions require documented reason, impact analysis, compensating signal, and review.

## Verification
Inspect drift definitions, baseline lineage, threshold tests, historical backtesting, alert-to-investigation records, and links to downstream quality metrics.