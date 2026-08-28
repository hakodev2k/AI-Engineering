# Redo, Undo, and Archivelog Management

## Purpose
Engineer redo, undo, archive logging, and recovery-area capacity for reliable recovery and stable transaction performance.

## When to use
Use for log-switch storms, checkpoint pressure, ORA-01555, FRA saturation, heavy batch operations, or recovery-design reviews.

## Inputs
Redo generation rates, transaction profile, retention needs, backup cadence, RPO, FRA/storage metrics.

## Context to inspect
Redo log groups/sizes, standby redo, archive destinations, checkpoint metrics, undo tablespace/retention, long queries, FRA usage, and flashback requirements.

## Core knowledge
Redo protects recoverability; undo supports rollback and read consistency. Undersizing or unmanaged retention causes operational incidents, while oversized choices can lengthen recovery or waste storage.

## Procedure
1. Measure peak redo generation and log-switch frequency.
2. Size redo groups for stable switching and recovery objectives.
3. Validate multiplexing/failure-domain placement where appropriate.
4. Measure undo consumption and longest required query duration.
5. Configure undo capacity/retention from evidence.
6. Review archive destinations and failure handling.
7. Size FRA for backups, archives, flashback, and operational headroom.
8. Alert on utilization and archive failures before saturation.
9. Test recovery assumptions using archived redo.

## Decision points
Increase redo size when switches are pathologically frequent; address write workload or checkpoint causes rather than sizing alone. Guarantee undo retention only when storage capacity supports the requirement.

## Common failure patterns
FRA full outages, deleting archives manually without recovery awareness, undersized undo, and treating ORA-01555 as only an undo-size problem.

## Verification
Confirm healthy switch cadence, archive continuity, undo success for long queries, and recoverability in restore tests.

## Expected output
Capacity settings and monitoring thresholds tied to recovery objectives.

## Stop conditions
Stop when backup/recovery retention requirements are unknown.