# Auditability Rules

## Purpose
Ensure material flag decisions and mutations can be reconstructed after incidents, disputes, and reviews.

## Scope
Administrative changes, approvals, automated mutations, and evaluation configuration history.

## MUST
- Production mutations MUST record actor, timestamp, affected flag, prior state, resulting state, and source when supported.
- High-risk approvals MUST be traceable to the corresponding change.
- Audit records MUST have retention and access controls appropriate to their sensitivity.
- Automated changes MUST identify the automation identity rather than impersonating a human.

## MUST NOT
- Audit history MUST NOT be disabled merely to reduce noise or cost for privileged operations.
- Shared identities MUST NOT obscure accountability.
- Sensitive targeting data MUST NOT be duplicated into audit logs unnecessarily.

## SHOULD
- Investigation tooling SHOULD correlate flag changes with incidents and deployments.

## Exceptions
Platform limitations require compensating evidence and documented remediation.

## Verification
Sample mutation records, compare with change tickets or approvals, test automation identity, and inspect retention controls.