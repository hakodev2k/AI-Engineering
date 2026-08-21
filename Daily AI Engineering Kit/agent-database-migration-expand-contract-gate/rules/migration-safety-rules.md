# Migration Safety Rules

## MUST
- Inspect current schema, target schema, application readers/writers, and deployment ordering before changing a migration.
- Use expand-contract for breaking schema evolution when old and new application versions can overlap.
- Prove backfill completeness with an explicit verification query before contract cleanup.
- Keep migration, application compatibility, backfill, and verification evidence distinct.
- Treat generated ORM migrations as reviewable code.
- Require explicit human approval for production migration, destructive schema changes, irreversible transforms, large table rewrites, type narrowing, and enforced constraints that may reject existing data.
- Preserve scanner/build/test evidence when a stage fails.
- Use least-privilege database access and approved non-production environments for automated checks.

## MUST NOT
- Do not run production migrations automatically.
- Do not drop or rename a schema object solely because application code no longer references it.
- Do not set `NOT NULL` until existing data is proven compliant or a safe default/backfill has completed.
- Do not assume rollback is safe after data mutation.
- Do not place secrets, connection strings, tokens, or production credentials in package evidence.
- Do not silently increase tool or database permissions.
- Do not retry destructive SQL.
- Do not mark a migration verified merely because the migration command returned success.

## SHOULD
- Prefer additive schema changes and dual-read/dual-write transitions over big-bang changes.
- Prefer idempotent, restartable backfills with bounded batches.
- Prefer forward-fix procedures when rollback could destroy post-migration writes.
- Record remaining operational risks such as lock duration, index build cost, replication lag, and long transactions.
