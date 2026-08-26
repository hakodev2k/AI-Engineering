# Alerting and SLO Rules

## Purpose
Tie CDN operations to measurable user-facing reliability objectives.

## Scope
Applies to SLIs, SLOs, error budgets, alerts, paging thresholds, and delivery dependencies.

## MUST
- Critical delivery services MUST define user-relevant availability and latency indicators.
- Alerts MUST correspond to actionable conditions with an owner and response procedure.
- SLO calculations MUST state traffic scope, exclusions, and measurement source.
- CDN and origin failure signals MUST be distinguishable where operational response differs.
- Error-budget decisions MUST use consistent definitions.

## MUST NOT
- MUST NOT page on metrics that have no defined operator action.
- MUST NOT hide failed traffic through exclusions introduced after an incident.
- MUST NOT treat provider availability claims as equivalent to application SLO attainment.

## SHOULD
- Prefer symptom-based paging and diagnostic alerts for causes.
- Use multi-window burn-rate alerting when appropriate.
- Review thresholds after meaningful architecture or traffic changes.

## Exceptions
Temporary alert suppression requires reason, owner, expiry, and alternative monitoring for material risk.

## Verification
Review SLI queries, alert rules, routing, runbooks, historical incident detection, false-positive rates, and error-budget calculations.