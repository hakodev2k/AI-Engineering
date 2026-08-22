# Drift Monitoring Rules
## Purpose
Detect when production data or model behavior no longer matches validated assumptions.
## Scope
Feature, prediction, label, concept, and performance drift.
## MUST
- Monitor production signals tied to model assumptions and business risk.
- Define actionable thresholds, owners, and response procedures for material drift.
- Compare drift by critical cohort when aggregate monitoring can hide failures.
## MUST NOT
- Treat statistical drift alone as proof that retraining is required.
- Ignore sustained drift without documented investigation.
## SHOULD
- Combine distribution monitoring with delayed ground-truth performance where available.
## Exceptions
Low-risk models may use lower-frequency review justified by impact analysis.
## Verification
Inspect dashboards, alert thresholds, incident history, cohort analysis, and retraining decisions.