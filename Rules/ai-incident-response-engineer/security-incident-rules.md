# Security Incident Rules

## Purpose
Ensure AI-related security incidents are contained, investigated, and escalated using defensible security practices.

## Scope
Applies to prompt injection with security impact, unauthorized access, secret exposure, data exfiltration, model or artifact tampering, compromised dependencies, and abuse of AI capabilities.

## MUST
- Security incidents MUST follow applicable security incident-response and forensic requirements in addition to AI-specific procedures.
- Suspected credential exposure MUST trigger credential-impact assessment and approved rotation/revocation procedures.
- Authorization failures MUST be investigated at the enforcement boundary, not only at the model-output layer.
- Evidence MUST identify affected identities, resources, time window, access path, and observed actions where available.
- Material compromise indicators MUST be escalated to designated security authority promptly.
- Security remediation MUST be validated with tests, configuration inspection, or equivalent evidence.

## MUST NOT
- Security controls MUST NOT be disabled to simplify investigation without explicit authorization and compensating safeguards.
- Responders MUST NOT execute offensive tests against systems outside approved scope.
- Secrets MUST NOT be pasted into prompts, tickets, chat transcripts, or logs during investigation.

## SHOULD
- Coordinate with security operations, identity, privacy, and legal stakeholders according to impact.
- Preserve indicators useful for detection-rule improvements.

## Exceptions
Emergency security actions may precede normal change process only when authorized by incident policy and must be documented afterward.

## Verification
Review security logs, IAM records, secret-scanner results, forensic evidence, remediation tests, and approval records.