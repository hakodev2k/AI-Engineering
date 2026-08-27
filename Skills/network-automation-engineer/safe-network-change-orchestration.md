# Safe Network Change Orchestration

## Purpose
Coordinate network changes across many devices while limiting blast radius and preserving connectivity.

## When to use
Use for fleet rollouts, routing migrations, software-driven provisioning, and repeated maintenance.

## Inputs
Targets, topology/failure domains, change artifact, pre/postchecks, concurrency limits, rollback, and maintenance policy.

## Context to inspect
Redundancy groups, traffic paths, dependencies, rate limits, controller behavior, and current health.

## Core knowledge
Network concurrency must respect topology. Changing redundant peers simultaneously can turn safe single-node maintenance into an outage.

## Procedure
1. Group targets by shared failure domain.
2. Select canary devices with bounded impact.
3. Run prechecks.
4. Apply change to canary.
5. Run postchecks and stabilization timer.
6. Expand in controlled batches that preserve redundancy.
7. Pause automatically on error-rate or validation thresholds.
8. Roll back affected batch when criteria require.
9. Resume only after root cause is understood.
10. Record per-target state and evidence.

## Decision points
Use serial execution for tightly coupled peers; bounded parallelism for independent sites. Prefer progressive rollout over all-at-once speed.

## Common failure patterns
Alphabetical batching, simultaneous redundant-pair changes, no pause gate, retries after partial mutation, and losing per-device workflow state.

## Verification
Test orchestration against simulated failures, confirm batch limits, rollback behavior, and restart/resume correctness.

## Expected output
Topology-aware rollout plan, execution state, validation evidence, and rollback record.

## Stop conditions
Stop on canary failure, unexpected topology dependency, degraded redundancy, or inability to determine partial-change state.