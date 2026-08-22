# Migration Recovery Skill

## Purpose
Provide a bounded, evidence-driven response when a migration fails, partially applies, or produces unsafe postconditions.

## Inputs
Exact migration plan, gate result, execution logs, migration history, schema state, monitoring evidence, backup/snapshot reference, rollback/compensation plan, and approval record.

## Procedure
1. Stop further rollout and preserve the exact execution evidence.
2. Determine whether the migration is fully unapplied, partially applied, fully applied with bad postconditions, or application-incompatible.
3. Compare actual schema/migration history with the expected plan; do not infer state from an error message alone.
4. Identify whether rollback is reversible without data loss. If data loss is possible, require human approval before rollback.
5. Prefer an already tested rollback or forward-fix path from the approved plan. Do not invent destructive recovery SQL during an incident and execute it automatically.
6. Gate any materially changed recovery plan as a new plan.
7. Execute recovery only through the authorized external mechanism.
8. Run read-only schema/data/application verification after recovery.
9. Retry a transient recovery tool failure once. Do not repeat a failed data-changing recovery action automatically.
10. Escalate if state is ambiguous, verification fails, or recovery would require broader permissions.

## Expected output
Observed state, evidence, chosen recovery path, required approval, execution reference, verification status, and residual risk.

## Verification
Migration history/schema state matches the intended recovered state, critical application queries succeed, defined invariants hold, and no new unapproved operation was introduced.

## Stop conditions
Ambiguous partial state, unavailable backup for destructive recovery, possible irreversible data loss without approval, permission escalation, or failed post-recovery verification.
