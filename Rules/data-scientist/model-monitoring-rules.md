# Model Monitoring Rules
## Purpose
Detect when deployed model behavior no longer supports its intended decision.
## Scope
Production predictions, inputs, outcomes, drift, calibration, and alerts.
## MUST
- Define monitored input, prediction, performance, calibration, data-quality, and business indicators appropriate to available labels.
- Establish thresholds, owners, escalation paths, and response actions before deployment.
- Compare production behavior with validated baselines and investigate material drift.
## MUST NOT
- Treat feature drift alone as proof that retraining is required.
- Leave alerts without an accountable response owner.
## SHOULD
- Monitor high-risk slices separately.
## Exceptions
Delayed labels require proxy monitoring plus scheduled outcome validation.
## Verification
Inspect dashboards, alert configuration, incident records, drift analyses, and retraining decisions.