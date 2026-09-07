# Snapshot Consistency Rules

## Purpose
Ensure snapshots represent recoverable application states rather than merely point-in-time storage images.

## Scope
Applies to volume, filesystem, database-adjacent, and distributed storage snapshots.

## MUST
- Define whether each snapshot is crash-consistent or application-consistent.
- Coordinate quiescing, ordering, or consistency groups when workload semantics require them.
- Test restore and application validation from snapshots.

## MUST NOT
- Advertise application-consistent recovery without evidence.
- Assume multi-volume snapshots are atomic unless the platform guarantees it.
- Delete the last known-good recovery snapshot during an active incident without approval.

## SHOULD
- Automate snapshot age, success, and restore validation checks.
- Document dependencies between snapshot state and external metadata.

## Exceptions
Crash-consistent snapshots are acceptable when workload recovery procedures explicitly tolerate them and are tested.

## Verification
Inspect snapshot policy, consistency configuration, restore tests, application validation, and retention records.