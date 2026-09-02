# Model Quality Monitoring

## Purpose
Ensure production model quality is measured against explicit acceptance criteria rather than inferred from system health.

## Scope
Applies to supervised, ranking, generative, anomaly, recommendation, and other ML systems with measurable outcome quality.

## MUST
- Production quality monitoring MUST define task-appropriate metrics, baselines, acceptance ranges, and evaluation windows.
- Metrics MUST reflect business or user impact when technically convenient surrogate metrics are insufficient.
- Critical regressions MUST be evaluated by meaningful cohorts, not only global aggregates.
- Metric calculations MUST identify model version and evaluation-data provenance.

## MUST NOT
- MUST NOT claim model quality is stable because serving latency and error rate are stable.
- MUST NOT change metric definitions or baselines without traceable review.
- MUST NOT hide materially degraded cohorts behind aggregate improvement.

## SHOULD
- Use multiple complementary quality measures when one metric cannot represent important failure modes.
- Track confidence intervals or uncertainty when sample sizes materially affect interpretation.

## Exceptions
Metric omissions require documented task limitations, alternative evidence, risk, and model-owner approval.

## Verification
Inspect metric specifications, evaluation queries, baseline history, cohort dashboards, reproducibility tests, and alert-to-review records.