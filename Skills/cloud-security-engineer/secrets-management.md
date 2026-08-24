# Secrets Management

## Purpose
Prevent credential leakage by controlling secret creation, storage, distribution, rotation, and revocation.

## When to use
Use when introducing credentials, reviewing repositories or pipelines, responding to leakage, or migrating from static configuration.

## Inputs
Secret inventory, applications, deployment mechanisms, secret stores, access policies, rotation capabilities, and logs.

## Context to inspect
Inspect source history, CI variables, images, manifests, runtime environment, secret-manager policies, backups, and access logs.

## Core knowledge
Secrets should be minimized, centrally managed, encrypted, access-controlled, auditable, short-lived where possible, and rotatable without unsafe downtime.

## Procedure
1. Inventory secret-bearing systems.
2. Eliminate unnecessary secrets using identity federation.
3. Move remaining secrets to approved stores.
4. Restrict read access by workload identity.
5. Define rotation and revocation procedures.
6. Prevent logging and accidental serialization.
7. Add repository and pipeline secret scanning.
8. Test rotation and application reload behavior.
9. Revoke exposed credentials immediately.

## Decision points
Prefer dynamic credentials when supported; use static secrets only when integration constraints require them and compensate with rotation and monitoring.

## Common failure patterns
Secrets in Git history, shared credentials, indefinite lifetimes, plaintext CI output, broad secret-reader roles, and rotation procedures never tested.

## Verification
Scan relevant artifacts, verify store policies, rotate a representative secret safely, and confirm old credentials fail.

## Expected output
A controlled secret lifecycle with ownership, rotation evidence, and reduced static credential inventory.

## Stop conditions
Escalate if revocation risks critical outage, credential ownership is unknown, or exposure may require incident response.