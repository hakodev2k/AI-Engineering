# Data Lifecycle and Retention

## Purpose
Control creation, retention, archival, and deletion of database data.

## Scope
Operational records, history, soft deletion, archival, legal retention, and purge processes.

## MUST
- Data classes MUST have documented retention and deletion requirements.
- Purge and archival processes MUST preserve required integrity, auditability, and recovery constraints.
- Destructive deletion in production MUST require explicit authorization when it is irreversible or materially impacts users.
- Retention changes MUST assess compliance, storage, performance, and downstream dependencies.

## MUST NOT
- MUST NOT retain sensitive data indefinitely without a defined purpose.
- MUST NOT delete data required for active legal, regulatory, contractual, or recovery obligations.
- MUST NOT use soft deletion as a substitute for an actual retention policy.

## SHOULD
- Prefer automated lifecycle enforcement with auditable exceptions.
- Archived data SHOULD have documented retrieval expectations and integrity validation.

## Exceptions
Exceptions require purpose, scope, duration, legal or business basis, risk, and accountable approval.

## Verification
Inspect retention configuration, deletion jobs, archive tests, audit records, data inventories, and exception approvals.