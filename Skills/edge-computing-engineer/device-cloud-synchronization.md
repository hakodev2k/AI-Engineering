# Device-Cloud Synchronization

## Purpose
Synchronize state safely between edge nodes and cloud services under delay, duplication, reordering, and intermittent connectivity.

## When to use
Use when edge nodes create or modify data that must converge with upstream systems.

## Inputs
- Data ownership rules
- Event or record schema
- Connectivity model
- Ordering requirements
- Conflict semantics

## Context to inspect
Inspect identifiers, timestamps, version fields, retry behavior, transport guarantees, local persistence, and cloud ingestion contracts.

## Core knowledge
Synchronization requires explicit authority, versioning, idempotency, ordering scope, deduplication, tombstones, and conflict resolution. Network delivery is not equivalent to business-level exactly-once processing.

## Procedure
1. Classify data by authoritative owner.
2. Assign stable operation and entity identifiers.
3. Define version or causal metadata.
4. Persist outbound changes before acknowledging local completion.
5. Make upstream application idempotent.
6. Define ordering only where the domain requires it.
7. Handle deletes with durable semantics.
8. Detect conflicts rather than silently overwriting.
9. Define retry, quarantine, and replay procedures.
10. Test clock skew, duplicates, gaps, reordering, and long disconnections.

## Decision points
Use last-write-wins only when loss of concurrent intent is acceptable. Use version vectors, merge rules, or explicit conflict workflows when concurrent updates matter.

## Common failure patterns
- Trusting wall-clock timestamps as total ordering
- Non-idempotent replay
- Missing delete propagation
- Infinite poison-message retries
- Hidden cloud authority assumptions

## Verification
Prove convergence with duplicate, delayed, reordered, conflicting, and replayed updates across representative edge nodes.

## Expected output
A synchronization contract covering ownership, versions, replay, deduplication, conflicts, and recovery.

## Stop conditions
Stop when the domain cannot define authoritative ownership or acceptable conflict behavior.