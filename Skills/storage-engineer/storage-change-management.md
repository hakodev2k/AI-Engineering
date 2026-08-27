# Storage Change Management

## Purpose
Execute storage changes with bounded blast radius, rollback, observability, and explicit data-safety controls.

## When to use
Use for firmware, configuration, zoning, upgrades, expansions, rebalance policy, filesystem changes, or controller maintenance.

## Inputs
Change intent, affected systems, dependencies, vendor guidance, compatibility matrix, backups, rollback path, maintenance window, and monitoring.

## Context to inspect
Current health, redundancy, active incidents, replication/rebuild state, capacity, firmware/software versions, client dependencies, and recent changes.

## Core knowledge
Storage changes can have irreversible data consequences. Healthy redundancy before maintenance is a prerequisite, not a convenience. One-failure-domain-at-a-time changes reduce correlated risk.

## Procedure
1. Define success, failure, and rollback criteria.
2. Validate backups/recovery and current redundancy.
3. Check compatibility and release notes.
4. Map blast radius and dependencies.
5. Establish pre-change health baseline.
6. Apply to a canary or one failure domain when possible.
7. Observe latency, errors, paths, replication, and integrity.
8. Continue incrementally only after acceptance criteria pass.
9. Roll back on defined triggers.
10. Perform post-change validation and record evidence.

## Decision points
Prefer rolling changes over simultaneous upgrades; postpone when degraded redundancy or recovery backlog exists. Use maintenance windows when failover or client interruption is plausible.

## Common failure patterns
Upgrading degraded clusters, no rollback artifact, simultaneous controller/fabric changes, skipping compatibility checks, and relying on vendor success messages without client validation.

## Verification
Compare pre/post metrics, test client I/O, validate redundancy/path state, confirm no new errors, and verify backups/replication remain healthy.

## Expected output
Approved change plan, rollback plan, execution log, validation evidence, and follow-up actions.

## Stop conditions
Abort when prechecks fail, redundancy is degraded, unexpected errors appear, rollback becomes unavailable, or integrity signals change.