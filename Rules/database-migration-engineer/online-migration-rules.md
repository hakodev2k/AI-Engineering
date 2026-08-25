# Online Migration

## Purpose
Protect availability when migrations occur under live traffic.

## Scope
Covers zero- or low-downtime schema and data migrations.

## MUST
- Online migrations MUST account for concurrent reads, writes, transactions, retries, and mixed application versions.
- Long lock acquisition, table rewrites, and blocking DDL risks MUST be measured or rehearsed before production.
- Cutover MUST have explicit health gates and an abort threshold.

## MUST NOT
- MUST NOT label a migration zero-downtime without evidence under representative concurrency.
- MUST NOT assume a database feature is online merely because its syntax permits concurrent operation.

## SHOULD
- Prefer nonblocking primitives, phased constraints, shadow structures, or online rebuild mechanisms when supported and validated.
- Schedule residual high-impact operations during lower-risk windows.

## Exceptions
Planned downtime may be safer when formally accepted and bounded by recovery objectives.

## Verification
Inspect lock tests, workload rehearsal, database documentation for the deployed version, telemetry, cutover gates, and rollback drills.