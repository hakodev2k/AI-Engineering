# Audit Logging Rules

## Purpose
Ensure compliance-relevant actions can be reconstructed from trustworthy system records.

## Scope
Applies to administrative changes, access events, approvals, policy changes, sensitive data operations, and security-relevant actions.

## MUST
- Audit events MUST identify actor, action, target, outcome, and reliable timestamp where applicable.
- Audit records MUST be protected from unauthorized modification and deletion.
- Logging scope MUST cover events required to demonstrate or investigate compliance state.
- Time synchronization and retention MUST support meaningful event reconstruction.

## MUST NOT
- MUST NOT log secrets or unnecessary sensitive payloads merely to increase audit detail.
- MUST NOT rely on application debug logs as the sole audit trail for material control actions.

## SHOULD
- Centralize audit records and monitor gaps or ingestion failures.

## Exceptions
Reduced logging requires documented privacy or technical constraint, compensating evidence, and approval.

## Verification
Inspect event schemas, sample records, retention, integrity controls, access restrictions, and gap monitoring.