# Rollback and Recovery

## Purpose
Ensure failed migrations can be contained and recovered safely.

## Scope
Covers rollback, roll-forward, restore, replay, and compensating recovery.

## MUST
- Every risky migration MUST identify the last safely recoverable state and the procedure to reach it.
- Recovery procedures MUST account for writes accepted after migration begins.
- Backup or snapshot recovery claims MUST be supported by restore testing, not backup-job success alone.

## MUST NOT
- MUST NOT call a rollback safe if it can discard post-cutover writes without an approved reconciliation strategy.
- MUST NOT perform destructive recovery actions without human approval.

## SHOULD
- Prefer forward-compatible remediation when rollback would create greater data risk.
- Define recovery time and recovery point expectations before execution.

## Exceptions
When rollback is technically impossible, the migration requires explicit approval of a tested forward-recovery plan.

## Verification
Review restore drills, replay tests, recovery timing, write-reconciliation procedures, backups, and approval records.