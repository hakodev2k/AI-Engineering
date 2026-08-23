# Implement concurrency control

## Purpose
Apply the smallest repository-consistent change that prevents silent lost updates.

## Inputs
Verified investigation report and affected write paths.

## Procedure
1. Prefer the persistence technology's native optimistic-concurrency primitive.
2. Ensure the token/version is loaded with the entity and participates in the update predicate.
3. Convert zero-row/version-conflict results into an explicit conflict outcome; never report success.
4. For APIs, preserve the existing public contract unless change is required and approved. If ETag/version is already exposed, validate it consistently.
5. Do not automatically replay a stale read-modify-write. A retry may occur only after re-reading state and reapplying an operation proven safe to replay.
6. Add deterministic two-writer tests covering conflict detection and preservation of the winning write.
7. Run build, targeted tests, then broader configured verification.
8. Inspect the diff for unrelated changes.

## Expected output
Minimal implementation, tests, and evidence bundle.

## Failure handling
Allow two fix/test iterations. After the second failed iteration, stop and hand off evidence.

## Approval boundary
Schema changes, breaking contracts, production configuration, destructive operations, or weakened concurrency checks require explicit human approval.