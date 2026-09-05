# Audit Logging Rules

## Purpose
Preserve reliable evidence of security-relevant container, registry, and orchestrator activity.

## Scope
Applies to registry events, cluster audit logs, admission decisions, workload changes, runtime alerts, and privileged administrative actions.

## MUST
- Security-relevant create, update, delete, permission, admission, and deployment events MUST be logged where the platform supports them.
- Audit records MUST identify actor or workload identity, target resource, action, result, and time.
- Audit data MUST be retained according to incident-response and compliance requirements.
- Logs used for investigation MUST be protected against modification by ordinary workloads.
- Sensitive values MUST be redacted or excluded while preserving enough context for investigation.

## MUST NOT
- MUST NOT disable audit logging to reduce operational noise without approved alternative evidence.
- MUST NOT log secrets, tokens, private keys, or sensitive payloads unnecessarily.
- MUST NOT treat application logs as a substitute for control-plane audit records.

## SHOULD
- Correlate registry, CI/CD, orchestrator, and runtime events using stable identities and timestamps.
- Alert on high-risk administrative actions and policy bypasses.

## Exceptions
Exceptions require documented platform limitation, alternative evidence source, risk assessment, and approval.

## Verification
Inspect audit configuration, sample events, retention settings, access controls, redaction behavior, and incident timelines.