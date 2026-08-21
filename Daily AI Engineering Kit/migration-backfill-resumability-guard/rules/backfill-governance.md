# Backfill Governance Rules

## MUST
- Bind every checkpoint to exact `migration_id`, revision and `plan_fingerprint`.
- Use a stable deterministic ordering/cursor.
- Use an idempotent or deduplicated write strategy before enabling retry/resume.
- Verify each chunk before advancing its checkpoint.
- Advance checkpoints with optimistic version checking.
- Preserve failed-attempt evidence and retry counters.
- Treat unknown write outcomes as `unknown` until destination read-back proves the result.
- Require explicit human approval before production start, destructive transforms, schema changes, deletes, irreversible rollback writes, secret/config/security changes.
- Require independent review for policy-classified high-risk work.
- Distinguish `executed` from `verified` and `completed`.

## MUST NOT
- Resume from a cursor copied from conversation memory or logs when a durable checkpoint exists.
- Change predicate, ordering key, transform, source, target or idempotency semantics under the same plan fingerprint.
- Retry until success.
- Advance the checkpoint when chunk verification failed or is unknown.
- Use offset pagination over a concurrently mutating source unless explicitly proven safe.
- Let two workers hold the same live checkpoint lease.
- Increase DB/tool permissions to recover automatically.
- Mark completion from processed count alone.

## SHOULD
- Prefer keyset/range cursors and small transactions.
- Record source/target counts and business invariants before and after.
- Use provider-native idempotency/concurrency tokens when available.
- Keep checkpoint store separate from ephemeral agent context.
- Make rollback/compensation itself resumable when it can be long-running.
