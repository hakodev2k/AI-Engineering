# Safe Schema Migrations

## Purpose
Change PostgreSQL schemas with controlled locking, backward compatibility, and rollback/recovery paths.

## When to use
Use for production DDL, large backfills, constraint changes, column/type evolution, and index deployment.

## Inputs
Current/target schema, table sizes, traffic profile, application deployment sequence, downtime budget.

## Context to inspect
PostgreSQL version, lock behavior of intended DDL, replicas, migration framework, long transactions, disk headroom.

## Core knowledge
DDL can acquire strong locks or rewrite tables. Safe evolution often uses expand-migrate-contract: introduce compatible structure, backfill incrementally, switch consumers, then remove legacy structure.

## Procedure
1. Define compatibility across old/new application versions.
2. Determine lock and rewrite characteristics of every statement.
3. Split high-risk changes into phases.
4. Add indexes concurrently when appropriate.
5. Add/validate constraints in low-lock phases where supported.
6. Backfill in bounded batches with observability.
7. Deploy application transitions.
8. Validate data and usage.
9. Contract only after rollback window closes.
10. Document recovery steps.

## Decision points
Prefer online phased migration over one-shot DDL for large/hot relations. A rollback may be forward-fix rather than reverse DDL.

## Common failure patterns
Unbounded UPDATE, surprise table rewrite, dropping old columns immediately, ignoring replica lag, assuming transactional rollback removes operational impact.

## Verification
Rehearse on production-like volume; verify locks, duration, data correctness, application compatibility and replication health.

## Expected output
Sequenced migration plan, DDL, safety gates, rollback/recovery procedure.

## Stop conditions
Escalate if destructive change, downtime, or irreversible data transformation lacks approval.