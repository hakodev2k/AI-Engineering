# Release Concurrency Control

## Purpose
Prevent overlapping releases and stale-state updates from corrupting deployment state or causing nondeterministic outcomes.

## When to use
Use when multiple pipelines, teams, repositories, or automation actors can target the same environment, branch, registry label, or deployment resource.

## Inputs
Release triggers, target resources, state stores, branch/ref behavior, deployment APIs, locking capabilities, and expected parallelism.

## Preconditions
Shared mutable resources and safe independent concurrency boundaries can be identified.

## Context to inspect
Inspect pipeline concurrency groups, environment locks, optimistic version tokens, Git SHAs, deployment generations, mutable tags, migration locks, and cancellation behavior.

## Core knowledge
Serialize only operations that mutate the same logical state; excessive global locking destroys throughput. Optimistic concurrency is effective when conflicts can be detected and operations safely rebuilt from current state. Never resolve stale-state conflicts by force overwriting unrelated newer work.

## Procedure
1. Inventory shared mutable release resources.
2. Define the smallest safe concurrency key for each resource.
3. Choose locking, queueing, or optimistic concurrency semantics.
4. Attach expected version/generation/SHA to updates where supported.
5. On conflict, re-read current state before retrying.
6. Rebuild only the pending intended change on top of current state.
7. Bound retries and add jitter where contention is possible.
8. Make cancellation leave target state explicit.
9. Test simultaneous releases and stale writers.
10. Monitor conflict and queue rates.

## Decision points
Use serialization for non-commutative deployment/migration operations; optimistic concurrency for independently rebuildable state updates; parallelize across truly independent environments or services.

## Common failure patterns
Force updates, stale SHA reuse, global locks for unrelated services, parallel migrations against one schema, mutable artifact tags, and automatic retry without re-reading state.

## Verification
Run competing release attempts and confirm no newer unrelated state is lost, conflicts are detected, retries use fresh state, and retry exhaustion fails safely.

## Expected output
Explicit concurrency semantics and tested conflict-handling behavior for release automation.

## Stop conditions
Stop when the target API cannot detect stale writes for high-risk shared state, safe locking is unavailable, or a conflict involves independently modified target content requiring human merge.