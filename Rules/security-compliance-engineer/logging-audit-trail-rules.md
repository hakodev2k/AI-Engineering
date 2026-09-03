# Logging and Audit Trail Rules

## Purpose
Ensure security-relevant activity can be reconstructed, attributed, and reviewed for compliance and investigations.

## Scope
Applies to authentication, authorization, administrative actions, security events, configuration changes, data access, and control-relevant system activity.

## MUST
- Audit logs MUST capture the actor or identity, action, target, outcome, timestamp, and relevant context for material events.
- Log retention and protection MUST meet applicable requirements and prevent unauthorized modification or deletion.
- Time sources MUST be sufficiently synchronized to support event correlation.
- Logging coverage MUST be reviewed when systems or control requirements change.

## MUST NOT
- Secrets, authentication tokens, or unnecessary sensitive payloads MUST NOT be logged.
- Audit logging MUST NOT be disabled without approved change and risk assessment.
- Missing telemetry MUST NOT be represented as evidence that no relevant activity occurred.

## SHOULD
- Centralize audit logs and monitor high-risk administrative activity.
- Test log completeness during control validation and incident exercises.

## Exceptions
Logging limitations require documented rationale, impact, compensating telemetry, remediation plan, and approval.

## Verification
Inspect log configuration, retention controls, sample events, access permissions, clock synchronization, and attempts to alter or delete audit records.