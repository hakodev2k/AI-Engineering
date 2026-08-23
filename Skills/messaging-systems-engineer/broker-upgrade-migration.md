# Broker Upgrade and Migration

## Purpose
Upgrade or migrate messaging infrastructure without breaking contracts, losing messages or causing uncontrolled downtime.

## When to use
Use for broker version upgrades, platform replacement or topology migration.

## Inputs
Source/target capabilities, topology, clients, compatibility, data volume, downtime tolerance and rollback requirements.

## Context to inspect
Protocol versions, producers/consumers, schemas, ACLs, offsets, retention, observability and infrastructure automation.

## Core knowledge
Migration correctness includes messages, consumer positions, security policy and operational behavior—not just endpoint connectivity.

## Procedure
1. Inventory dependencies and guarantees.
2. Identify semantic/capability differences.
3. Establish target infrastructure and controls.
4. Test client compatibility.
5. Define dual-write, bridge or cutover strategy.
6. Reconcile messages and offsets.
7. Cut consumers/producers in controlled stages.
8. Monitor and retain rollback path.
9. Decommission only after evidence window.

## Decision points
Prefer staged migration for critical workloads; use hard cutover only when downtime and rollback are acceptable.

## Common failure patterns
Missing ACL/schema migration, duplicate dual writes and premature source deletion.

## Verification
Reconcile counts/business outcomes and execute rollback rehearsal.

## Expected output
A staged migration plan with validation gates.

## Stop conditions
Escalate when rollback, compatibility or data reconciliation cannot be demonstrated.