# Rollback and Roll-forward

## Purpose
Design reliable recovery paths when a release causes unacceptable behavior.

## When to use
Use for every production release strategy and especially for schema, stateful, protocol, or irreversible changes.

## Inputs
Artifact history, deployment platform, database changes, compatibility guarantees, incident objectives, feature flags, and backup/restore capabilities.

## Preconditions
Known-good artifact identities and ownership for recovery decisions are available.

## Context to inspect
Inspect deployment history, migrations, data writes, external side effects, API compatibility, queues, caches, feature flags, and restoration procedures.

## Core knowledge
Rollback is safe only when old code remains compatible with current state. Some releases require roll-forward because data or external effects cannot be reversed. Recovery design must precede deployment.

## Procedure
1. Classify release changes as reversible, conditionally reversible, or irreversible.
2. Identify state changes that outlive code deployment.
3. Ensure backward/forward compatibility during the recovery window.
4. Define rollback commands and permissions.
5. Define roll-forward hotfix path.
6. Define feature-disable or traffic-isolation alternatives.
7. Set recovery decision thresholds and authority.
8. Test recovery in a production-like environment.
9. Measure expected recovery duration.
10. Record actual recovery outcomes after incidents.

## Decision points
Rollback when a known-good version is compatible and fastest; roll forward when state evolution makes rollback unsafe; disable a feature when it isolates impact faster than deployment recovery.

## Common failure patterns
Assuming redeploying an old binary is sufficient, irreversible migrations in the same step as code activation, restoring databases without accounting for newer writes, and recovery instructions that depend on unavailable experts.

## Verification
Exercise rollback and roll-forward paths, validate data integrity, confirm known-good health returns, and measure recovery against objectives.

## Expected output
A tested recovery plan tied to release classes and explicit decision criteria.

## Stop conditions
Stop a release when irreversible state changes lack an approved recovery approach, backups are unverified, or compatibility with the previous version is unknown.