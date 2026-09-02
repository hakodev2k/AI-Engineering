# On-Call Operations Rules

## Purpose
Maintain safe, sustainable, and effective production support coverage.

## Scope
Applies to on-call rotations, escalations, handoffs, paging response, and operator readiness.

## MUST
- On-call ownership MUST be explicit for every production-critical service.
- Responders MUST have the access, runbooks, dashboards, and escalation paths required for expected incidents.
- Handoffs MUST communicate active incidents, risky changes, degraded dependencies, and temporary mitigations.
- Repeated pages from the same failure mode MUST trigger corrective follow-up rather than permanent manual toil.

## MUST NOT
- MUST NOT rely on undocumented tribal knowledge for critical response procedures.
- MUST NOT leave a responder solely accountable for an incident beyond their authority or expertise without escalation options.
- MUST NOT normalize chronic alert fatigue as an acceptable operating condition.

## SHOULD
- Measure page volume, response quality, and recurring operational toil.
- Regularly exercise escalation and access procedures.

## Exceptions
Temporary coverage exceptions require explicit owner, duration, compensating escalation, and risk acceptance.

## Verification
Review rotations, escalation maps, access checks, paging records, handoff artifacts, and recurring incident trends.
