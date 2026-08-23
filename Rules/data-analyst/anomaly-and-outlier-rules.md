# Anomaly and Outlier Rules

## Purpose
Handle unusual values without hiding real events or distorting results.

## Scope
Data validation, trend analysis, segmentation, forecasting inputs, and reporting.

## MUST
- Distinguish data errors from legitimate extreme observations before exclusion.
- Quantify the influence of material outliers on conclusions.
- Document any winsorization, trimming, capping, or exclusion rule.
- Investigate sudden metric shifts against instrumentation, business events, and source changes.

## MUST NOT
- MUST NOT remove outliers solely because they weaken a preferred conclusion.
- MUST NOT apply arbitrary thresholds without a documented rationale.

## SHOULD
- Use robust summaries or sensitivity analysis when distributions are highly skewed.

## Exceptions
Operational monitoring may use predefined anomaly thresholds when those thresholds are governed and periodically reviewed.

## Verification
Review exclusion logic, before/after distributions, sensitivity results, event timelines, and source-system change logs.