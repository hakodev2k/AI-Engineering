# Durability and Integrity Rules

## Purpose
Prevent silent data loss and corruption.

## Scope
Applies to persisted data, metadata, checksums, replicas, erasure-coded fragments, and repair workflows.

## MUST
- Define measurable durability targets and corruption-detection mechanisms.
- Verify data integrity across write, replication, storage, read, and repair paths.
- Preserve evidence when corruption is detected and bound the affected data set before repair.

## MUST NOT
- Declare data safe solely because replicas exist.
- Repair or overwrite suspected-corrupt data before retaining diagnostic evidence.
- Disable integrity checks to improve throughput without approved risk acceptance.

## SHOULD
- Use end-to-end checksums and periodic scrubbing where supported.
- Test latent corruption and incomplete-write scenarios.

## Exceptions
Any reduced integrity control requires documented reason, scope, duration, compensating control, and approval.

## Verification
Inspect checksum configuration, scrub results, repair logs, corruption drills, and recovery tests.