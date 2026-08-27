# Chain of Custody Rules

## Purpose
Ensure evidence handling is attributable, chronological, and defensible.

## Scope
Applies from collection through transfer, storage, analysis, disclosure, and disposition.

## MUST
- Every custody event MUST identify evidence, actor, timestamp, action, purpose, and receiving location or custodian.
- Transfers MUST be recorded at the time they occur.
- Custody records MUST distinguish physical possession from logical access.
- Access to evidence MUST be limited to authorized personnel and auditable.
- Gaps or inconsistencies MUST be documented and assessed for impact before reporting conclusions.
- Time references MUST identify timezone or normalization convention.

## MUST NOT
- MUST NOT backfill custody events as if recorded contemporaneously.
- MUST NOT share evidence through unapproved channels.
- MUST NOT use ambiguous identifiers that can refer to multiple items.
- MUST NOT conceal a custody gap.

## SHOULD
- Use tamper-evident storage and immutable audit records where available.
- Minimize transfers and unnecessary handlers.

## Exceptions
Emergency handling requires retrospective documentation clearly marked as such, reason, risk assessment, corroborating evidence, and responsible approval.

## Verification
Reconcile custody logs against access logs, storage records, ticket history, acquisition timestamps, and evidence identifiers; investigate every unexplained discontinuity.