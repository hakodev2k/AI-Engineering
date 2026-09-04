# Security and Auditability Rules

## Purpose
Ensure AI observability strengthens security investigation without creating new sensitive-data or access risks.

## Scope
Applies to audit events, access logs, model and tool actions, observability stores, administrative changes, and security investigations.

## MUST
- Access to sensitive observability data MUST be authenticated, authorized by least privilege, and auditable.
- Privileged changes to telemetry collection, redaction, retention, alerting, or access policy MUST produce durable audit records.
- Security-relevant AI actions such as policy blocks, privileged tool use, authorization failures, and unusual access patterns MUST be observable with bounded, non-secret context.
- Audit records MUST include actor or service identity, action, target class, outcome, timestamp, and correlation context where appropriate.
- Security claims based on telemetry MUST be supported by configuration inspection, test evidence, or observed events.

## MUST NOT
- Audit logs MUST NOT contain credentials, raw secrets, or unrestricted sensitive content.
- Operational administrators MUST NOT be able to silently disable critical audit coverage without an independently visible record where platform capabilities permit.
- Absence of a security alert MUST NOT be treated as proof that no security event occurred.

## SHOULD
- Separate high-integrity audit storage from routine high-volume application logs.
- Monitor unexpected changes to redaction, retention, and telemetry access policy.

## Exceptions
Reduced auditability requires documented platform limitation, compensating controls, residual risk, and security-owner approval.

## Verification
Inspect access controls, audit schemas, privileged-change records, retention controls, redaction tests, and simulated authorization failures or policy events.