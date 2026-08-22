# Migration Safety Rules
## Purpose
Evolve schemas and data without avoidable outages or irreversible loss.
## Scope
DDL, data migrations, backfills, compatibility windows, and cutovers.
## MUST
- Classify migration risk, lock behavior, runtime, compatibility, rollback, and data-loss potential before production execution.
- Use staged expand/migrate/contract approaches when applications cannot tolerate an atomic breaking change.
- Validate backups or recovery capability before destructive or irreversible migration steps.
## MUST NOT
- Execute destructive production DDL or data deletion without explicit human approval.
- Assume a migration safe because it completed quickly on a small environment.
## SHOULD
- Rehearse high-risk migrations against production-like scale.
## Exceptions
Emergency changes require explicit approval, bounded blast radius, and post-change verification.
## Verification
Review migration scripts, dry runs, lock tests, row counts, compatibility tests, backups, and rollback evidence.