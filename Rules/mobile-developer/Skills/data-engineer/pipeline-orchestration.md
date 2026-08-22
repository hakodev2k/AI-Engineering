# Pipeline Orchestration

## Purpose
Coordinate data workflows with explicit dependencies, scheduling, state, retries, concurrency, and recovery.

## When to use
Use when multiple data tasks must execute in a controlled dependency graph or on recurring/event-driven triggers.

## Inputs
Task graph, SLAs, schedules, dependencies, resource constraints, retry policy, and ownership.

## Context to inspect
Inspect task idempotency, external dependencies, execution duration, historical failures, concurrency limits, backfill needs, and orchestrator capabilities.

## Core knowledge
An orchestrator should coordinate work rather than contain business transformations. Reliable DAGs have clear state, bounded retries, deterministic parameters, dependency isolation, and observable ownership.

## Procedure
1. Define task boundaries around independently retryable units.
2. Express real dependencies explicitly.
3. Choose schedule or event triggers from freshness requirements.
4. Make task parameters deterministic for a logical data interval.
5. Configure bounded retries and timeouts by failure class.
6. Prevent unsafe overlapping runs.
7. Add SLA, failure, and stale-run alerts.
8. Support backfills without rewriting production history accidentally.
9. Record run metadata and links to logs.
10. Test rerun and partial-failure behavior.

## Decision points
Use event triggers when upstream completion is authoritative; use schedules when sources lack reliable completion signals. Split DAGs when ownership or failure domains differ materially.

## Common failure patterns
Sleep-based dependencies, giant monolithic tasks, retrying deterministic data errors, hidden cross-DAG coupling, and backfills competing unboundedly with current production runs.

## Verification
Simulate task failure, retry, timeout, overlapping schedules, and a historical backfill; verify downstream state remains correct.

## Expected output
An observable orchestration graph with deterministic intervals, safe retries, bounded concurrency, and documented recovery.

## Stop conditions
Stop when a dependency has no reliable completion signal or required concurrency controls are unavailable.