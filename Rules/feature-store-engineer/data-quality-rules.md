# Feature Data Quality Rules

## Purpose
Detect invalid feature values before they create model degradation or production incidents.

## Scope
Completeness, validity, uniqueness, range, distribution, cardinality, referential integrity, and anomaly detection.

## MUST
- Critical features MUST have explicit quality checks aligned to their semantics.
- Quality rules MUST distinguish expected missingness from pipeline or source failures.
- Failed blocking checks MUST prevent unsafe promotion or materialization when configured as release gates.
- Significant distribution shifts MUST be investigated before being dismissed.
- Quality checks MUST identify the affected feature version and time range.

## MUST NOT
- MUST NOT use arbitrary statistical thresholds without historical or domain rationale.
- MUST NOT silently coerce malformed values into valid-looking defaults.
- MUST NOT treat passing schema validation as sufficient quality evidence.

## SHOULD
- Baselines SHOULD account for seasonality and known business events.
- Quality incidents SHOULD produce regression checks where practical.

## Exceptions
Accepted anomalies require evidence, impact assessment, expiration, and owner approval.

## Verification
Review quality test definitions, failure history, anomaly evidence, and incident follow-up.