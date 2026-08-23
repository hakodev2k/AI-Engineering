# Investigate optimistic concurrency

## Purpose
Prove whether concurrent writers can silently overwrite each other.

## Inputs
Task scope, affected aggregate/entity, persistence technology, relevant endpoints/jobs, tests and logs.

## Preconditions
Work from a clean repository state. Do not mutate production data.

## Allowed tools
Repository search, local build/test tools, local or disposable database, logs with secrets removed.

## Procedure
1. Identify every read-modify-write entry point for the affected state.
2. Trace the persistence call and transaction boundary.
3. Record whether a version/ETag/rowversion/concurrency token is read and checked on write.
4. Identify retry logic and determine whether it re-reads current state before retrying.
5. Build a two-writer timeline with the same initial version.
6. Reproduce concurrently in an isolated environment.
7. Preserve commands, timestamps, initial state, both writes and final state as evidence.
8. Classify the result as `safe`, `lost-update-confirmed`, `inconclusive`, or `approval-required`.

## Expected output
A completed investigation report using `templates/investigation-report.md`.

## Verification
A lost update is confirmed only when both writers report success while one intended mutation disappears, or equivalent repository/database evidence proves it.

## Failure handling
Retry environment/tool startup at most twice. Do not retry a business concurrency conflict as infrastructure failure.

## Stop conditions
Stop on production-only reproduction, destructive setup, missing authorization, or insufficient evidence.