# Freshness and Consistency

## Purpose
Make search freshness guarantees explicit and prevent stale or contradictory result behavior.

## Scope
Near-real-time indexing, refresh, replication, deletion propagation, and source/index divergence.

## MUST
- Define measurable freshness objectives for creates, updates, and deletes where users depend on them.
- Prioritize deletion and access-revocation propagation according to security and privacy risk.
- Detect sustained source/index divergence.
- Document read-after-write expectations for workflows that expose search immediately after mutation.

## MUST NOT
- Promise immediate consistency when the architecture is eventually consistent.
- Hide known indexing lag behind generic success responses when callers require searchable state.
- allow revoked access to remain searchable beyond approved bounds.

## SHOULD
- Expose freshness telemetry and backlog age.
- Provide explicit workflows for cases requiring stronger read-after-write behavior.

## Exceptions
Exceptions require defined maximum staleness, affected workflows, compensating controls, and approval.

## Verification
Measure ingestion-to-search latency, deletion propagation, backlog age, reconciliation drift, and failure recovery.