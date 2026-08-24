# Filesystem and Volume Rules

## Purpose
Manage filesystems and volumes with predictable correctness, capacity, and recovery behavior.

## Scope
Formatting, mounting, resizing, allocation, quotas, inode/metadata limits, and volume lifecycle.

## MUST
- Filesystem and volume choices MUST be compatible with workload, platform, recovery, and support requirements.
- Resizes and layout changes MUST verify filesystem, volume, and underlying storage constraints in the correct order.
- Critical mounts MUST define expected boot/failure behavior to avoid cascading outages.
- Quotas and reservations MUST be used where uncontrolled consumers can threaten shared capacity.

## MUST NOT
- MUST NOT format, recreate, shrink, or detach a production volume without verified target identity, recovery plan, and human approval.
- MUST NOT rely on free-byte percentage alone when inode or metadata exhaustion is possible.

## SHOULD
- Prefer online, reversible operations when supported and proven safe.

## Exceptions
Unsupported legacy layouts require documented operational procedures and risk ownership.

## Verification
Inspect filesystem metadata, mount configuration, volume maps, quota settings, capacity telemetry, and change evidence.