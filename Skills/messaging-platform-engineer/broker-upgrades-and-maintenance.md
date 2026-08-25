# Broker Upgrades and Maintenance

## Purpose
Plan and execute broker upgrades, patching, certificate changes, and maintenance with controlled compatibility risk and minimal service disruption.

## When to use
Use for version upgrades, managed-service maintenance, protocol changes, rolling restarts, and security patching.

## Inputs
- Current and target versions
- Release notes and compatibility matrix
- Client version inventory
- SLOs and maintenance constraints
- Rollback options

## Context to inspect
Inspect broker health, replication, controller/quorum state, client protocol versions, deprecated features, disk headroom, automation, and recent incidents.

## Core knowledge
Senior engineers should understand rolling upgrade order, inter-broker/client protocol compatibility, mixed-version operation, partition leadership, quorum safety, maintenance throttling, and rollback limitations.

## Procedure
1. Read release notes and identify breaking, deprecated, and migration requirements.
2. Inventory client versions and unsupported integrations.
3. Validate the target version in a representative non-production environment.
4. Confirm cluster health and capacity headroom before maintenance.
5. Define rolling order, pause criteria, and rollback point.
6. Upgrade a canary node or cluster first where possible.
7. Monitor replication, leadership, latency, errors, and consumer lag after each stage.
8. Complete protocol/format upgrades only after rollback to the old version is no longer required.
9. Record evidence and update operating procedures.

## Decision points
Prefer rolling upgrades when mixed versions are supported. Use blue/green migration when in-place upgrade risk, rollback limitations, or architecture changes are substantial.

## Common failure patterns
- Upgrading protocol formats too early
- Starting with an unhealthy cluster
- Ignoring old client compatibility
- No pause thresholds between nodes
- Treating successful process restart as successful service recovery

## Verification
Verify quorum, replication, publish/consume tests, latency, lag, and client compatibility after each phase and after completion.

## Expected output
A tested upgrade plan, execution record, rollback boundary, and verified post-upgrade health.

## Stop conditions
Stop on under-replication, quorum instability, unexplained client errors, insufficient rollback capability, or incompatible critical clients.