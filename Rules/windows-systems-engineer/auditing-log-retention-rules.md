# Auditing and Log Retention

## Purpose
Preserve trustworthy evidence for security, operations, and accountability.

## Scope
Windows audit policy, event logs, forwarding, retention, privileged actions, and access to audit data.

## MUST
- Audit policy MUST cover security-relevant authentication, privilege, policy, account, and system events appropriate to risk.
- Critical logs MUST be forwarded or protected so local compromise cannot silently erase all evidence.
- Retention MUST satisfy operational, security, and applicable governance needs.
- Access to centralized audit data MUST be restricted and itself auditable.
- Material reductions in audit coverage or retention MUST require human approval.

## MUST NOT
- MUST NOT disable auditing to reduce noise without an evidence-based replacement.
- MUST NOT collect secrets or unnecessary sensitive content in logs.
- MUST NOT treat log presence as proof that required events are actually captured.

## SHOULD
- Test audit rules using representative actions.
- Monitor forwarding gaps, clock skew, and unexpected volume changes.

## Exceptions
Require reason, affected evidence, duration, compensating telemetry, risk, and approval.

## Verification
Generate known test events, confirm collection and timestamps, inspect retention and access controls, and review gaps across representative systems.