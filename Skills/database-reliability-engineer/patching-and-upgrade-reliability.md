# Patching and Upgrade Reliability

## Purpose
Upgrade database engines and extensions while controlling compatibility, availability, performance, and rollback risk.

## When to use
Use for security patches, minor/major engine upgrades, extension changes, and managed-service version transitions.

## Inputs
Current/target versions, release notes, compatibility matrix, workload tests, topology, maintenance windows, and rollback options.

## Context to inspect
Deprecated features, drivers, extensions, replication compatibility, backup format, parameter changes, and provider constraints.

## Core knowledge
Upgrades can alter query plans, defaults, storage formats, and replication. A technically successful upgrade is incomplete until workload behavior is verified.

## Procedure
1. Inventory versions, extensions, and clients.
2. Review supported upgrade paths and breaking changes.
3. Establish baseline performance and correctness.
4. Test representative workloads on target version.
5. Validate backup and rollback/recovery options.
6. Define staged rollout and failover sequence.
7. Upgrade noncritical or replica nodes first when supported.
8. Monitor plans, latency, errors, and replication.
9. Complete rollout only after acceptance gates pass.

## Decision points
Choose in-place upgrade for simplicity when rollback is acceptable; use blue/green or logical migration when isolation and rollback justify complexity.

## Common failure patterns
Skipping driver compatibility, no baseline, unsupported downgrade assumptions, simultaneous fleet upgrade, and ignoring plan regressions.

## Verification
Run compatibility, integrity, failover, performance, and recovery checks on the target version.

## Expected output
A staged upgrade plan, acceptance gates, rollback strategy, and verified production outcome.

## Stop conditions
Stop on unsupported compatibility, failed recovery tests, unexplained regression, or unavailable rollback path for high-risk changes.