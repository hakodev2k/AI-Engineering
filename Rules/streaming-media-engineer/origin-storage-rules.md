# Origin and Storage Rules

## Purpose
Protect media durability, consistency, retrieval performance, and cache correctness at storage and origin boundaries.

## Scope
Object storage, origin services, live buffers, VOD assets, metadata, retention, and replication.

## MUST
- Media publication MUST have an explicit durability and visibility model before manifests reference it.
- Object naming and mutability rules MUST prevent cache ambiguity and accidental content replacement.
- Retention policies MUST account for replay windows, legal/business requirements, and recovery needs.
- Origin capacity MUST be tested for cache-miss and failover scenarios, not only normal cache-hit traffic.

## MUST NOT
- MUST NOT delete or overwrite production media outside approved lifecycle procedures when recovery or contractual retention can be affected.
- MUST NOT use temporary local state as the sole copy of required media.
- MUST NOT assume storage success without checking the operation's actual consistency and durability guarantees.

## SHOULD
- Immutable content-addressed or versioned objects SHOULD be preferred where practical.
- Replication strategy SHOULD match recovery objectives and failure domains.

## Exceptions
Alternative storage semantics require documented durability, recovery, cache, and cost trade-offs.

## Verification
Inspect lifecycle policy, replication status, restore tests, cache-miss load tests, object consistency checks, and deletion controls.