# Audit Logging Rules

## Purpose
Provide trustworthy evidence of secret-management actions without disclosing protected material.

## Scope
Authentication, authorization, reads, issuance, rotation, revocation, policy changes, administration, and break-glass activity.

## MUST
- Audit records MUST identify actor, action, target identifier, outcome, time, and relevant request context.
- Logs MUST be protected against unauthorized modification and access.
- Privileged administrative changes and sensitive secret reads MUST be retained according to applicable policy.
- Time synchronization and event correlation MUST support incident reconstruction.

## MUST NOT
- Secret values, private keys, session tokens, or recoverable authentication material MUST NOT be logged.
- Audit failures MUST NOT silently disable monitoring for high-risk operations.
- Routine administrators MUST NOT be able to erase evidence of their own actions without independent controls.

## SHOULD
- Forward critical audit events to an independently administered monitoring system.
- Alert on unusual reads, policy changes, failed access, and emergency operations.

## Exceptions
Reduced logging requires documented technical constraint, compensating evidence source, risk acceptance, and review date.

## Verification
Inspect sample events, retention settings, integrity controls, redaction tests, SIEM ingestion, alert tests, clock synchronization, and privileged access to audit stores.