# Database Audit Logging Rules

## Purpose
Provide trustworthy evidence for privileged activity, security investigation, and accountability.

## Scope
Applies to authentication, authorization changes, privileged queries, schema/security changes, and access to high-risk data where required.

## MUST
- Audit events MUST identify actor, action, target, outcome, and reliable time context to the extent supported.
- Privilege grants, role changes, authentication-policy changes, and audit-configuration changes MUST be logged.
- Audit records MUST be protected from unauthorized alteration and deletion.
- Retention MUST satisfy investigation, operational, and applicable compliance needs.
- Audit pipelines MUST be monitored for loss, delay, or disabled collection.

## MUST NOT
- Audit logs MUST NOT contain plaintext secrets, tokens, or unnecessary sensitive payloads.
- Administrators MUST NOT be able to silently disable auditing without detection where platform controls permit.
- Absence of an audit event MUST NOT be interpreted as proof an action did not occur when collection health is uncertain.

## SHOULD
- Centralize security-relevant audit data outside the database trust boundary.
- High-risk events SHOULD have actionable detection coverage.

## Exceptions
Reduced auditing requires documented performance/privacy rationale, risk analysis, alternative evidence, and approval.

## Verification
Review audit configuration, sample events, retention, integrity controls, collector health, alert tests, and privileged-action traces. Conduct periodic end-to-end event generation and retrieval tests.