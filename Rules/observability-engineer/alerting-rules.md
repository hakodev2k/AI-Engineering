# Alerting Rules
## Purpose
Page humans only for actionable conditions requiring timely response.
## Scope
Pages, tickets, warnings, thresholds, and routing.
## MUST
- Give every paging alert an owner, severity, actionable condition, and response guidance.
- Alert on sustained user-impact or imminent critical failure where practical.
- Test routing and notification paths.
## MUST NOT
- Page solely on noisy symptoms with no expected responder action.
- Silence recurring alerts permanently instead of addressing cause or redesigning detection.
## SHOULD
- Prefer SLO/burn-rate or symptom-based alerts over fragile static thresholds.
## Exceptions
Safety or compliance controls may require conservative threshold alerts.
## Verification
Review alert history, false-positive rate, response actions, routing tests, and incident correlation.