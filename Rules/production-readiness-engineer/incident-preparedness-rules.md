# Incident Preparedness Rules
## Purpose
Ensure production teams are prepared to detect, coordinate, and recover from serious failures.
## Scope
Critical launches, major architecture changes, high-risk migrations, and systems with incident-response obligations.
## MUST
- Critical systems MUST have defined incident ownership, escalation paths, communication channels, and severity criteria.
- Readiness MUST confirm responder coverage and required access for elevated-risk launch windows.
- Known severe failure scenarios MUST have containment and recovery guidance.
- Dependencies requiring external escalation MUST have accessible contact paths.
- Incident evidence collection MUST preserve logs, timelines, decisions, and relevant system state.
## MUST NOT
- A launch MUST NOT rely on one unavailable individual for essential recovery knowledge.
- Incident communication MUST NOT expose secrets or unnecessary sensitive data.
- Severity MUST NOT be minimized to avoid escalation requirements.
## SHOULD
- Conduct game days or tabletop exercises for high-impact changes.
- Predefine stakeholder communication patterns for likely severe scenarios.
## Exceptions
Reduced coverage requires explicit risk acceptance, constrained rollout, and compensating controls.
## Verification
Inspect escalation policy, on-call coverage, access checks, exercises, communication plans, and recovery runbooks.