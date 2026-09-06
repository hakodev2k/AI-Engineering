# Snapshot and Bootstrap Rules

## Purpose
Create a complete initial state without gaps or duplicates between snapshot data and live changes.

## Scope
Initial snapshots, high-water marks, cutover positions, chunking, and resumption.

## MUST
- Snapshot and streaming phases MUST share a documented consistency boundary.
- The cutover source position MUST be captured durably.
- Snapshot chunking MUST be deterministic or safely resumable.
- Concurrent writes during snapshot MUST be reconciled without missing committed changes.
- Bootstrap completion MUST be validated against source counts or stronger reconciliation evidence.

## MUST NOT
- MUST NOT start streaming from an arbitrary time after snapshot completion.
- MUST NOT assume a long-running snapshot is transactionally consistent unless the source guarantees it.
- MUST NOT discard the snapshot boundary before verification.

## SHOULD
- Throttle snapshots to protect source workload.
- Prefer resumable chunks for large tables.

## Exceptions
Approximate bootstraps require explicit consumer acceptance and bounded correctness impact.

## Verification
Inspect boundary positions, snapshot logs, reconciliation results, concurrent-write tests, and restart behavior.