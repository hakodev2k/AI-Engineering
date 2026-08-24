# Backup and Recovery Awareness Rules

## Purpose
Ensure SQL changes respect recoverability and do not create false assumptions about data restoration.

## Scope
High-risk DML/DDL, repair scripts, retention, point-in-time recovery dependencies, and recovery validation.

## MUST
- Before destructive production changes, recovery capability MUST be confirmed against required RPO/RTO and the specific failure scenario.
- Recovery assumptions MUST distinguish backup existence from tested restorability.
- High-risk data changes MUST preserve enough evidence to identify affected scope.
- SQL engineers MUST coordinate with database operations owners when a change affects backup, log, or recovery behavior.

## MUST NOT
- MUST NOT claim a destructive action is safe merely because backups exist.
- MUST NOT truncate, purge, or irreversibly transform production data without explicit approval.
- MUST NOT alter recovery-critical configuration outside delegated authority.

## SHOULD
- Prefer reversible transformations and staged deletion where requirements allow.
- Include recovery checkpoints around exceptional high-risk maintenance.

## Exceptions
Incident actions may prioritize service/data protection but still require authorized command, bounded scope, and recorded evidence.

## Verification
Inspect recovery configuration and recent restore-test evidence, confirm recovery points, review affected-row evidence, and validate post-change recoverability with responsible operators.