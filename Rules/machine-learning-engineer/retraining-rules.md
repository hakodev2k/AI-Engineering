# Retraining Rules
## Purpose
Ensure retraining is controlled, evidence-driven, and safe.
## Scope
Scheduled, triggered, and manual retraining.
## MUST
- Define retraining triggers from measurable freshness, drift, performance, or business requirements.
- Re-run full promotion evaluation for newly trained artifacts.
- Preserve prior approved artifacts for rollback according to retention policy.
## MUST NOT
- Auto-promote a retrained model solely because training completed successfully.
- Retrain blindly in response to drift without investigating whether data, labels, or environment changed incorrectly.
## SHOULD
- Separate retraining automation from promotion authorization.
## Exceptions
Fully automated promotion requires explicit governance, bounded risk, validated gates, and rollback automation.
## Verification
Inspect trigger logic, evaluation gates, approvals, artifact history, and rollback readiness.