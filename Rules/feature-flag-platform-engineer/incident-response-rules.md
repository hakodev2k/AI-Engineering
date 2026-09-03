# Incident Response Rules

## Purpose
Make feature flags a controlled incident-response mechanism rather than an additional source of uncertainty.

## Scope
Applies to incidents involving faulty rollouts, provider outages, incorrect targeting, configuration drift, and emergency flag changes.

## MUST
- Incident responders MUST identify whether a flag change, deployment, or external dependency preceded the failure.
- Emergency flag actions MUST have a named operator, stated objective, and observable success criterion.
- Incident timelines MUST include relevant flag configuration changes.
- After stabilization, temporary emergency states MUST be reviewed for safe restoration or retirement.
- Recurring flag-related incidents MUST result in corrective actions addressing the underlying control failure.

## MUST NOT
- MUST NOT make repeated speculative flag changes without checking observable effects.
- MUST NOT restore previous flag state blindly when the underlying system state has changed.
- MUST NOT erase audit evidence after an incident.

## SHOULD
- Runbooks SHOULD identify the highest-value flags for common failure scenarios.

## Exceptions
During severe incidents, shortened documentation is acceptable if essential evidence is captured and completed afterward.

## Verification
Review incident timelines, audit logs, runbooks, post-incident actions, and evidence linking changes to outcomes.