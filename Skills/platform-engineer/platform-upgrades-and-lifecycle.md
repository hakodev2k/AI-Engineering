# Platform Upgrades and Lifecycle

## Purpose
Evolve shared platform components without uncontrolled compatibility breaks or security debt.

## When to use
Use for Kubernetes, runtimes, providers, APIs, plugins, operating systems, or platform component upgrades.

## Inputs
Version inventory, support windows, release notes, compatibility data, consumers, and rollback capability.

## Context to inspect
Deprecated APIs, pinned dependencies, extensions, test environments, migration tooling, and production topology.

## Core knowledge
Platform lifecycle management requires inventory, compatibility contracts, staged rollout, observability, and explicit deprecation.

## Procedure
1. Inventory versions and consumers.
2. Identify security and support deadlines.
3. Analyze breaking changes and deprecated behavior.
4. Build automated compatibility tests.
5. Upgrade isolated environments first.
6. Publish migration guidance and deadlines.
7. Roll out progressively with rollback checkpoints.
8. Remove deprecated paths only after verified migration.

## Decision points
Accelerate security-critical upgrades; allow longer migration for breaking changes with broad consumer impact.

## Common failure patterns
Big-bang upgrades, undocumented deprecations, no consumer inventory, skipped rollback testing, and permanent legacy support.

## Verification
Representative workloads pass, telemetry remains healthy, rollback is proven, and consumer migration status is known.

## Expected output
A lifecycle plan with compatibility analysis, rollout stages, migration support, and retirement criteria.

## Stop conditions
Stop when rollback is impossible or critical consumers have unknown compatibility.