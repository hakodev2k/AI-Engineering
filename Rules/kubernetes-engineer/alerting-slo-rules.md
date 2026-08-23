# Alerting and SLO Rules
## Purpose
Alert on actionable reliability risk rather than raw platform noise.
## Scope
Service objectives, alerts, paging, routing, and operational ownership.
## MUST
- Define measurable objectives for critical platform capabilities and user-facing services where ownership permits.
- Page only on conditions requiring timely human action or imminent objective violation.
- Assign alert ownership, severity, runbook context, and escalation path.
- Review chronic noisy alerts and missed incidents using evidence.
## MUST NOT
- Page solely because a metric crossed an arbitrary threshold without impact context.
- Leave production alerts without an accountable responder.
## SHOULD
- Prefer symptom and burn-rate signals over isolated infrastructure events for paging.
## Exceptions
Early-warning alerts may be non-paging when clearly classified and routed.
## Verification
Inspect alert definitions, SLO calculations, notification tests, incident history, false-positive rates, and ownership metadata.