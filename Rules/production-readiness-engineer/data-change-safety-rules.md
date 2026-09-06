# Data Change Safety Rules
## Purpose
Protect production data integrity during releases, migrations, backfills, and repairs.
## Scope
Writes, transformations, backfills, deletions, corrections, imports, exports, and bulk operations.
## MUST
- Data-changing operations MUST define scope, validation, failure behavior, and recovery before execution.
- High-volume or irreversible operations MUST be tested on representative data or safely sampled conditions.
- Data integrity invariants MUST be checked before and after material changes.
- Bulk changes MUST include throttling, batching, or containment when uncontrolled load could affect production.
- Destructive production data operations MUST require explicit human approval.
## MUST NOT
- An AI agent MUST NOT delete or destructively modify production data without explicit authorization.
- Production data MUST NOT be changed based solely on assumptions from incomplete records.
- Validation MUST NOT rely only on process exit status.
## SHOULD
- Prefer idempotent, restartable operations.
- Preserve audit evidence for initiator, approver, and verifier.
## Exceptions
Emergency repair requires incident context, minimized scope, recovery evidence, approval, and post-change verification.
## Verification
Review scripts, dry runs, invariants, samples, backups, approvals, and post-change checks.