# Migration Safety Rules

## MUST
- Inspect every migration file and identify destructive, locking, data-rewrite, and long-running operations.
- Produce a migration plan containing scope, affected objects, rollback path, backup requirement, expected lock/availability impact, and verification steps.
- Execute validation against a non-production database or an explicitly designated dry-run environment before production execution.
- Preserve command output, errors, and verification evidence.
- Stop when an approval-required operation is detected until explicit human approval exists.
- Treat schema changes, production configuration changes, destructive SQL, irreversible data transforms, and production execution as approval-required.
- Keep retry loops bounded to `max_retry_attempts` from `config/gate.yaml`.

## MUST NOT
- Run migration commands against production by default.
- Execute `DROP DATABASE`, `DROP TABLE`, `TRUNCATE TABLE`, or column-dropping operations automatically.
- Disable foreign keys, constraints, auditing, backups, or security controls merely to make a migration pass.
- Rewrite Git history, delete migration evidence, or hide failed checks.
- Claim success from code generation or compilation alone.
- Guess database credentials, connection strings, or production targets.

## SHOULD
- Prefer additive and backward-compatible migrations before destructive cleanup.
- Separate schema expansion, application rollout, data backfill, and schema contraction when zero-downtime deployment matters.
- Measure row counts, index size, lock behavior, and query impact when available.
- Prefer reversible operations and document residual risk when reversibility is impossible.
