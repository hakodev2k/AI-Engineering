# Storage Integrity Rules

## Purpose
Protect persisted data from silent corruption, incomplete writes, and unsafe lifecycle operations.

## Scope
Object stores, warehouses, databases, lakehouses, checkpoints, snapshots, and intermediate durable data.

## MUST
- Use atomic or transactional write patterns where supported for critical datasets.
- Detect incomplete, truncated, or partially published outputs before consumer exposure.
- Define retention, recovery, and integrity expectations for authoritative data.
- Validate stored data after migrations or large rewrites.

## MUST NOT
- Publish partially written partitions or files as complete.
- Delete authoritative data without an approved retention or recovery policy.
- Rely on storage durability alone as evidence of logical correctness.

## SHOULD
- Use checksums, manifests, snapshots, or equivalent integrity mechanisms when appropriate.
- Separate temporary staging data from committed consumer-visible data.

## Exceptions
Non-atomic publication requires documented failure handling, detection, recovery, and approval for critical paths.

## Verification
Inspect transaction settings, manifests, snapshots, integrity checks, recovery tests, and post-write validation.