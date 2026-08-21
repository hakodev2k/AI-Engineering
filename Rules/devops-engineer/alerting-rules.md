# Alerting Rules

## Purpose
Define reliable standards for operational alerts and service notifications.

## Scope
Applies to monitoring rules, severities, notification routing, escalation, and alert maintenance.

## MUST
- Critical alerts MUST represent conditions that require timely operational attention.
- Every critical alert MUST have an owner, severity, response guidance, and escalation path.
- Thresholds MUST use measured baselines, service objectives, or known failure boundaries where practical.
- Alert changes that affect incident detection MUST be reviewed and validated.
- Notification destinations MUST be monitored and maintained.

## MUST NOT
- MUST NOT create critical alerts for informational events that require no action.
- MUST NOT permanently suppress recurring alerts without addressing the underlying issue or documenting an approved exception.
- MUST NOT leave high-severity alerts without ownership.

## SHOULD
- Prefer alerts tied to user-visible symptoms and service objectives.
- Regularly remove stale, duplicate, and noisy rules.

## Exceptions
Temporary suppression requires an owner, reason, expiration, risk assessment, and alternative monitoring.

## Verification
Review alert definitions, notification history, acknowledgement records, false-positive patterns, escalation behavior, and response documentation.