# Skill — Schema Snapshot Pinning

## Purpose
Ensure each MCP tool call is validated against the same immutable schema generation that existed when the call was dispatched.

## Trigger
Before every tool dispatch and during every tool-list refresh.

## Inputs
Server instance id, current generation, tool metadata, call id, input/output schemas, refresh event.

## Preconditions
The active generation has completed schema compilation and passed publication checks.

## Required context
Current policy and last known-good generation.

## Allowed tools
Read-only MCP metadata access and `scripts/schema_generation_guard.py`.

## Constraints
Never mutate the active generation in place. Never rebind an in-flight call to a newer schema.

## Procedure
1. Canonicalize input and output schemas and compute SHA-256 hashes.
2. Build a generation id from server instance + deterministic ordered tool hashes.
3. Before dispatch, capture generation id and the exact validator reference/hash in the call record.
4. On refresh, compile all schemas into a staging snapshot.
5. Validate staging completeness and uniqueness.
6. Publish the staging snapshot atomically only if every schema compiles.
7. Let in-flight calls complete using their pinned validators.
8. Reclaim old generations only after no call references them.

## Decision points
- Compilation failure: reject staging generation and retain last known-good state.
- Result schema hash differs from pinned call hash: block completion and emit integrity failure.
- Change notification received while calls are in flight: refresh for future calls only.

## Expected output
Pinned call contract plus generation publication decision and metrics.

## Metrics
Cross-generation validation count, failed atomic refreshes, staging compile failures, stale-generation duration, in-flight generation reference count.

## Verification
Race fixture must start a call on generation A, publish B while pending, and prove the result still validates using A.

## Failure handling
Maximum two refresh retries. Preserve evidence and last known-good generation. Escalate persistent compilation failures.

## Stop conditions
Stop success when a complete generation publishes atomically or a failed refresh safely rolls back. Never loop indefinitely.
