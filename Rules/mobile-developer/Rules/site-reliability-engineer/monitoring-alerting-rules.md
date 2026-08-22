# Monitoring and Alerting Rules

## Purpose
Ensure monitoring detects meaningful service degradation and alerts produce actionable human response.

## Scope
Applies to production monitoring, alert policies, dashboards, paging systems, and health checks.

## MUST
- Paging alerts MUST correspond to conditions that require timely human action.
- Alerts MUST include enough context to identify the affected service, symptom, severity, and first diagnostic path.
- Alert thresholds MUST be validated against historical behavior and incident evidence.
- Monitoring coverage MUST include critical user journeys and dependency failures.
- Alert ownership and escalation paths MUST be explicit.

## MUST NOT
- MUST NOT page on purely informational events.
- MUST NOT disable noisy alerts without replacing or fixing the underlying detection gap.
- MUST NOT rely on a single signal when correlated signals are necessary to distinguish real incidents from noise.

## SHOULD
- Prefer symptom-based alerts over internal-cause alerts for primary paging.
- Alerts SHOULD link to relevant dashboards and runbooks.

## Exceptions
Temporary suppression requires an owner, reason, expiration, risk assessment, and alternate detection where needed.

## Verification
Review alert history, false-positive rate, missed incidents, paging outcomes, dashboard coverage, and suppression records.