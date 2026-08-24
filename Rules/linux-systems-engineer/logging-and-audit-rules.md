# Logging and Audit Rules

## Purpose
Provide trustworthy evidence for operations, security investigations, and accountability without creating new data exposure risks.

## Scope
Applies to system journals, syslog, audit frameworks, authentication logs, rotation, forwarding, retention, and time synchronization dependencies.

## MUST
- Security- and operations-critical events MUST be captured with timestamps and enough context to identify host, service, and action.
- Log retention and forwarding MUST align with incident, compliance, and capacity requirements.
- Log rotation MUST prevent unbounded disk consumption while preserving required evidence.
- Time synchronization MUST be monitored because event correlation depends on trustworthy clocks.
- Privileged access and material authentication events MUST be auditable where platform capabilities permit.

## MUST NOT
- Secrets, authentication tokens, or unnecessary sensitive payloads MUST NOT be intentionally logged.
- Local logs MUST NOT be treated as sufficient evidence when an attacker or failure can alter or destroy them and centralized logging is required.
- Audit rules MUST NOT be disabled solely because of volume without assessing why volume is high.

## SHOULD
- Forward critical logs off-host.
- Use structured fields where supported.
- Define retention by evidence need rather than arbitrary duration.

## Exceptions
Reduced logging requires documented capacity/privacy rationale, retained minimum evidence, owner, and risk approval where material.

## Verification
Inspect effective logging/audit configuration, generate representative events, confirm off-host receipt and timestamps, test rotation, review disk consumption, and validate that sensitive values are not emitted.