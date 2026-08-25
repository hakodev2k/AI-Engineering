# Migration and Change Security

## Purpose
Make schema, data, and platform changes without weakening security or exposing sensitive data.

## When to use
Use for migrations, engine upgrades, cloud moves, schema changes, bulk data movement, or security-control refactoring.

## Inputs
Migration plan, source/target architecture, schemas, data classifications, identities, rollback plan, and acceptance criteria.

## Context to inspect
Inspect temporary storage, migration tools, elevated accounts, network paths, compatibility, target defaults, logging, and cleanup steps.

## Core knowledge
Migrations create temporary attack surface: broad privileges, duplicate data, staging files, relaxed controls, and long-lived tooling. Security acceptance must cover the target and transition state.

## Procedure
1. Define security invariants before migration.
2. Inventory sensitive data and temporary copies.
3. Create narrowly scoped migration identities.
4. Secure transfer and staging paths.
5. Recreate grants, policies, encryption, audit, and network controls on target.
6. Validate schema and data integrity.
7. Test rollback without retaining unsafe copies.
8. Cut over with monitoring.
9. Revoke temporary access and destroy temporary data according to policy.

## Decision points
Online migration reduces downtime but extends coexistence and synchronization risk. Offline migration simplifies consistency but increases outage requirements.

## Common failure patterns
Migration accounts left active, target default privileges broader than source, plaintext dumps, forgotten staging buckets, and security validation deferred until after cutover.

## Verification
Compare source/target security controls, test access matrices, reconcile data, inspect audit trails, and confirm cleanup.

## Expected output
A migration with preserved security invariants and documented evidence.

## Stop conditions
Escalate when rollback is unsafe, destructive conversion is required, or target controls cannot meet mandatory requirements.