# Alerting and SLO Rules

## Purpose
Make ML alerts actionable and tie operational response to explicit reliability and model-quality objectives.

## Scope
Applies to alerts, SLOs, error budgets, paging, and escalation for production ML systems.

## MUST
- Paging alerts MUST represent conditions that require timely human action and MUST include owner, severity, affected scope, and investigation entry point.
- SLOs MUST define the measured population, calculation window, target, exclusions, and data source.
- Model-quality and data-health objectives MUST be represented separately from infrastructure availability when their failure modes differ.
- Alert thresholds MUST be validated against historical or test evidence before being treated as production-ready.

## MUST NOT
- MUST NOT page on unactionable informational anomalies.
- MUST NOT suppress recurring critical alerts without addressing root cause or adding an approved compensating control.
- MUST NOT redefine an SLO during an incident to make current behavior appear compliant.

## SHOULD
- Use multi-window or persistence logic where it reduces noise without masking fast severe failures.
- Route alerts according to operational ownership and business impact.

## Exceptions
Temporary alert changes require reason, expiry, risk assessment, and approval from the responsible owner.

## Verification
Review SLO specifications, alert history, false-positive and missed-incident analysis, escalation mappings, and response evidence.