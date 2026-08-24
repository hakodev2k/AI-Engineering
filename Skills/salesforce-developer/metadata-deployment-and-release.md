# Metadata Deployment and Release

## Purpose
Deliver Salesforce metadata changes safely across environments with dependency awareness, test gates, rollback planning, and post-deployment verification.

## When to use
Use for feature releases, schema changes, permission updates, Flow/Apex/LWC deployments, package updates, and urgent fixes.

## Inputs
Metadata manifest, source control diff, environment topology, test scope, migration steps, permission changes, rollback constraints.

## Context to inspect
Profiles/permission sets, destructive changes, package dependencies, API versions, org-specific configuration, feature toggles, deployment pipelines.

## Core knowledge
Metadata changes can be order-dependent and not all changes are trivially reversible. Code deployment success does not prove operational readiness; permissions, data migration, caches, scheduled jobs, and integrations may require coordinated steps.

## Procedure
1. Classify additive, modifying, and destructive changes.
2. Identify metadata and data dependencies.
3. Validate deployment in a representative lower environment.
4. Run required tests plus targeted regression tests.
5. Separate irreversible data/schema actions where prudent.
6. Prepare permission and configuration changes.
7. Define rollback or forward-fix strategy.
8. Deploy using source-controlled artifacts.
9. Execute post-deploy steps idempotently.
10. Verify key user journeys, integrations, jobs, and telemetry.

## Decision points
Prefer small reversible releases. Use feature flags/configuration when code can be deployed safely before activation.

## Common failure patterns
Manual drift, missing permissions, destructive changes without backup, environment-specific assumptions, and declaring success after metadata deployment alone.

## Verification
Confirm metadata versions, tests, smoke tests, permissions, integrations, jobs, and migration evidence in target environment.

## Expected output
A repeatable deployment plan with dependency, verification, and recovery evidence.

## Stop conditions
Stop when destructive changes lack approval/backup, dependencies are unresolved, or target environment differs materially from validated assumptions.