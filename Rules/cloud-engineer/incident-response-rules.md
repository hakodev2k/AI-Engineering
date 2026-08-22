# Incident Response Rules
## Purpose
Restore cloud services safely while preserving evidence and learning.
## Scope
Operational and security incidents involving cloud infrastructure and managed services.
## MUST
- Incident actions MUST prioritize safety, containment, service restoration, and evidence preservation according to severity.
- Material changes during incidents MUST be recorded with actor, time, reason, and observed result.
- Root-cause conclusions MUST be supported by logs, metrics, traces, audit events, configuration history, or equivalent evidence.
## MUST NOT
- MUST NOT perform irreversible remediation when a safer reversible action can contain the incident unless authorized by severity procedures.
- MUST NOT delete evidence required for investigation.
## SHOULD
- Separate mitigation from root-cause correction and follow-up prevention.
## Exceptions
Emergency authority must follow established incident policy and be reviewed afterward.
## Verification
Review timelines, audit logs, change records, telemetry, incident reports, follow-up actions, and approval records.