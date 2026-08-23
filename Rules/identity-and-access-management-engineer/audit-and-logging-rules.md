# Audit and Logging Rules

## Purpose
Produce reliable evidence of identity, access, and administrative activity.

## Scope
Authentication logs, authorization decisions, provisioning events, privilege changes, policy changes, and administrative actions.

## MUST
- Security-relevant IAM events MUST be logged with timestamp, actor, target, action, outcome, and correlation context where available.
- Audit logs MUST be protected against unauthorized alteration and access.
- Privilege grants, revocations, policy changes, recovery events, and break-glass use MUST be auditable.
- Retention MUST satisfy operational, incident-response, and applicable compliance requirements.
- Clock synchronization and timestamp interpretation MUST support reliable event ordering.

## MUST NOT
- MUST NOT log passwords, private keys, bearer tokens, or equivalent secrets.
- MUST NOT rely on volatile local logs as the sole audit record for critical IAM events.
- MUST NOT disable IAM logging to reduce storage or noise without approved risk treatment.

## SHOULD
- Logs SHOULD use stable identity and resource identifiers that support cross-system correlation.
- Detection rules SHOULD cover anomalous privilege, recovery, and authentication activity.

## Exceptions
Any logging gap requires documented cause, duration, risk, compensating monitoring, owner, and remediation plan.

## Verification
Inspect log schemas, retention settings, access controls, tamper protections, sample event correlation, secret-redaction tests, and detection coverage.