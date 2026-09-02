# Monitoring and Alerting Rules

## Purpose
Detect actionable production degradation early without creating alert fatigue.

## Scope
Applies to service health monitoring, alert policies, paging, dashboards, and synthetic checks.

## MUST
- Alerts MUST map to actionable conditions with an owner and documented response.
- Paging thresholds MUST represent material user, service, security, or data risk.
- Critical alerts MUST include enough context to begin triage without guessing the affected system.
- Alert changes MUST be validated against historical or test data where practical.

## MUST NOT
- MUST NOT page on raw noise, transient expected behavior, or metrics with no operator action.
- MUST NOT suppress persistent critical symptoms without resolving or explicitly accepting the underlying risk.
- MUST NOT use dashboards as a substitute for alerting on conditions requiring timely response.

## SHOULD
- Prefer symptom-based alerts tied to service objectives over implementation-detail alerts.
- Review noisy and stale alerts regularly.

## Exceptions
Exceptions require documented operational rationale, owner, compensating detection, and review date.

## Verification
Review alert definitions, paging history, response runbooks, false-positive rates, missed incidents, and dashboard coverage.
