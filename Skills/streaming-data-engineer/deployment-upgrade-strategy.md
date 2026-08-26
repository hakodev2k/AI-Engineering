# Streaming Deployment and Upgrade Strategy

## Purpose
Release streaming applications and platform changes without breaking contracts, state, offsets, or continuous processing.

## When to use
Use for application releases, framework upgrades, state-schema changes, broker upgrades, or topology migrations.

## Inputs
Current/new versions, state format, schemas, deployment platform, compatibility guarantees, rollback requirements.

## Context to inspect
Consumer groups, checkpoints/savepoints, generated schemas, partition changes, deployment history, SLOs.

## Core knowledge
Streaming deployments carry durable state and offsets across versions. Rollback may be impossible after incompatible state/schema mutations unless planned beforehand.

## Procedure
1. Classify code, contract, state, and topology changes.
2. Prove backward/forward compatibility.
3. Capture recoverable checkpoint/savepoint where supported.
4. Define deployment and rollback sequence.
5. Use canary/shadow processing for high-risk changes.
6. Monitor lag, errors, state restore, and output correctness.
7. Promote gradually.
8. Retain rollback artifacts until validation completes.

## Decision points
Use rolling upgrades only when mixed-version compatibility is proven; use stop-and-restore when state consistency requires coordinated transition.

## Common failure patterns
Assuming application rollback restores state; mixed incompatible consumers; changing topology and schema simultaneously; deleting old checkpoints early.

## Verification
Canary outputs reconcile, restore succeeds, SLOs remain healthy, and rollback procedure is tested or demonstrably valid.

## Expected output
Release plan, compatibility evidence, rollback path, and validation checklist.

## Stop conditions
Stop when state migration is irreversible without approved recovery strategy.