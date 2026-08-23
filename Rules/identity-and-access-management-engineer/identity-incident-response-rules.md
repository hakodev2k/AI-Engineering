# Identity Incident Response Rules

## Purpose
Contain and investigate identity compromise without destroying evidence or causing uncontrolled access loss.

## Scope
Account takeover, token theft, credential exposure, malicious privilege changes, compromised service identities, and suspicious federation events.

## MUST
- Suspected identity compromise MUST trigger containment proportional to impact and confidence.
- Containment actions MUST consider active sessions, refresh tokens, credentials, federation trusts, and downstream access.
- Evidence needed for investigation MUST be preserved before destructive cleanup when operationally safe.
- High-impact incidents MUST have explicit ownership, escalation, and communication paths.
- Recovery MUST verify identity assurance and access state before restoring normal privileges.

## MUST NOT
- MUST NOT reset only the password and assume all sessions or tokens are invalidated.
- MUST NOT delete compromised identities before required evidence is preserved unless immediate destruction is necessary for safety.
- MUST NOT restore privileged access without confirming root cause is removed or sufficiently contained.

## SHOULD
- Incident playbooks SHOULD include user, administrator, service-principal, secret, and federation compromise scenarios.
- Post-incident review SHOULD produce durable control improvements.

## Exceptions
Emergency deviations require incident-lead approval and must be documented retrospectively with rationale and evidence.

## Verification
Review incident playbooks, tabletop or exercise results, token-revocation procedures, forensic evidence handling, recovery checklists, and closed incident records.