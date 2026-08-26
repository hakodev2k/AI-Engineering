# Security and Access Migration

## Purpose
Migrate database identities, roles, privileges, encryption, and access paths without expanding privilege or exposing secrets.

## When to use
Use for every production database migration.

## Inputs
Users, roles, grants, authentication methods, secret stores, certificates, network policies, encryption configuration, audit requirements, and service identities.

## Core knowledge
Database security spans authentication, authorization, transport, network reachability, encryption at rest, key ownership, auditing, and privileged operations. Account names alone do not represent equivalent privileges.

## Procedure
1. Inventory human and workload identities.
2. Map source privileges to target capabilities.
3. Remove obsolete and excessive grants instead of cloning blindly.
4. Prefer managed/workload identity where supported.
5. Provision secrets through approved stores; never embed them in migration artifacts.
6. Validate TLS and certificate trust.
7. Configure network allowlists/private connectivity.
8. Enable required auditing.
9. Test positive and negative authorization cases.
10. Rotate temporary migration credentials after completion.

## Decision points
Preserve least privilege even if broader roles simplify migration. Use temporary elevated access only with expiry and audit controls.

## Common failure patterns
Copying admin credentials, privilege creep, missing service accounts, disabled TLS verification, and forgotten temporary grants.

## Verification
Compare effective permissions, run denied-access tests, inspect audit events, and confirm secret rotation.

## Expected output
A least-privilege target access model with verified connectivity and auditability.

## Stop conditions
Stop when required access would violate security policy or secrets cannot be handled through approved controls.