# IAM Migration and Cutover

## Purpose
Migrate identity providers, directories, authentication methods, roles, or provisioning systems without creating lockouts, privilege drift, or unmanaged parallel trust.

## When to use
Use for IdP consolidation, tenant migration, SSO migration, directory replacement, MFA modernization, or access-model transition.

## Inputs
Source/target systems, identities, applications, credentials, federation, entitlement mappings, dependencies, cutover window, rollback requirements, and support capacity.

## Context to inspect
Inspect account correlation, immutable identifiers, application integrations, claims, redirect URIs, provisioning, privileged accounts, service identities, recovery, certificates, and legacy fallback paths.

## Core knowledge
IAM migrations are security and continuity events. Parallel operation can reduce cutover risk but increases trust surface. Account correlation errors can cause takeover or data separation failures.

## Procedure
1. Inventory identities, integrations, trust, and critical dependencies.
2. Define authoritative mapping and immutable correlation rules.
3. Classify applications by risk and migration complexity.
4. Build target controls and test representative flows.
5. Pilot low-risk cohorts before critical systems.
6. Plan privileged and break-glass migration separately.
7. Define cutover, communication, support, and rollback criteria.
8. Monitor authentication, provisioning, and authorization during transition.
9. Remove obsolete trust and credentials after stabilization.
10. Reconcile identities and effective access post-migration.

## Decision points
Use phased migration when systems can coexist safely; use coordinated cutover where duplicate trust creates unacceptable ambiguity. Rollback must not restore known insecure state without explicit risk acceptance.

## Common failure patterns
Matching users by mutable email, forgetting service identities, leaving legacy login enabled indefinitely, untested key/certificate rollover, role drift, and no lockout recovery.

## Verification
Reconcile source/target identities, test critical applications and privileged paths, verify old trust is disabled, and review access anomalies after cutover.

## Expected output
A migration plan and completed cutover with mapping, risk controls, rollback, monitoring, reconciliation, and decommission evidence.

## Stop conditions
Stop when identity correlation is ambiguous, emergency access is untested, or rollback/cutover cannot protect critical operations.