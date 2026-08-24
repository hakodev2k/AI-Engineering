# Drift Detection Rules

## Purpose
Use drift evidence responsibly to identify changing production conditions without confusing change with degradation.

## Scope
Applies to data drift, concept drift proxies, prediction drift, and distribution monitoring.

## MUST
- Drift detection MUST define a reference population, comparison window, metric, threshold rationale, and operational response.
- Reference datasets MUST be versioned and periodically reviewed for continued relevance.
- Drift alerts MUST be correlated with quality, business, or domain evidence before high-risk corrective actions.
- Seasonality and known population shifts MUST be considered in threshold design.

## MUST NOT
- A statistically significant distribution change MUST NOT be labeled model failure without impact evidence.
- Retraining MUST NOT be automatically promoted solely because a drift detector fired.

## SHOULD
- Multiple complementary drift measures SHOULD be used for high-impact systems where one statistic is insufficient.
- Drift analysis SHOULD support important features and cohorts, not only global aggregates.

## Exceptions
Automated retraining may be permitted only when its closed-loop safety, evaluation gates, rollback, and bounded impact have been explicitly approved.

## Verification
Review detector configuration, reference versions, thresholds, seasonal handling, alert history, downstream decision logic, and evidence connecting drift to remediation.