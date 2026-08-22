# Data Migration and Upgrade Rules
## Purpose
Keep installed applications and on-device data safe across version upgrades and downgrades where supported.
## Scope
Local schema migrations, preference changes, file formats, cache invalidation, and app-version transitions.
## MUST
- Persistent data format changes MUST be migration-tested from every supported upgrade baseline that can reach the release.
- Migrations MUST define failure behavior before destructive transformation occurs.
- Irreversible migration risk MUST be identified before rollout and require human approval when user data can be lost.
## MUST NOT
- Production migrations MUST NOT assume users install every intermediate app version.
- Durable user data MUST NOT be deleted merely to simplify a schema upgrade without approved product policy.
## SHOULD
- Migrations SHOULD be idempotent or checkpointed when interruption is possible.
## Exceptions
Reproducible cache data may be discarded instead of migrated when rebuilding is safe and bounded.
## Verification
Test skipped-version upgrades, interrupted migrations, low storage, corrupted old data, backup restore, and rollback compatibility.