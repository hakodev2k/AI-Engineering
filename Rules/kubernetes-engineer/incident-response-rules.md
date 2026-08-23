# Incident Response Rules
## Purpose
Restore Kubernetes services safely while preserving evidence and controlling change risk.
## Scope
Triage, mitigation, escalation, communication, and post-incident actions.
## MUST
- Establish incident ownership, impact, timeline, hypotheses, and evidence for material production incidents.
- Prefer reversible mitigations that reduce customer impact while preserving diagnostic evidence.
- Record consequential cluster changes made during an incident.
- Validate recovery with service-level signals, not only pod status.
## MUST NOT
- Perform destructive remediation without understanding recovery implications and required approval.
- Present an unverified hypothesis as root cause.
## SHOULD
- Use tested runbooks for recurring failure modes and update them from incident learning.
## Exceptions
Immediate safety or outage containment may precede full diagnosis when impact justifies it; actions must remain attributable and reviewed afterward.
## Verification
Review incident timeline, audit/change records, telemetry, recovery evidence, approvals, and follow-up actions.