# Service Account and Workload Identity

## Purpose
Engineer non-human identities so applications and automation authenticate without unmanaged long-lived secrets or ambiguous ownership.

## When to use
Use for services, CI/CD, jobs, integrations, cloud workloads, bots, and automation accounts.

## Inputs
Workloads, environments, resource permissions, runtime platform, secret capabilities, ownership, rotation constraints.

## Context to inspect
Service accounts, API keys, certificates, cloud identities, Kubernetes identities, CI credentials, secret stores, ownership metadata.

## Core knowledge
Workload identity should be unique, scoped, short-lived where possible, attributable to an owner, and bound to runtime context. Human and machine identities require different lifecycle controls.

## Procedure
1. Inventory non-human identities and owners.
2. Map each identity to workload, environment, and required resources.
3. Eliminate shared identities where feasible.
4. Prefer platform-issued short-lived credentials over static secrets.
5. Scope permissions to required actions and resources.
6. Separate production and non-production identities.
7. Define rotation and revocation paths.
8. Detect unused and orphaned identities.
9. Log issuance and resource access.
10. Test credential theft, workload replacement, and owner departure scenarios.

## Decision points
Prefer workload federation or managed identities when platform support is mature; retain secrets only when compatibility requires them and rotation is reliable.

## Common failure patterns
Hard-coded keys, one service account shared by many workloads, ownerless accounts, production credentials in CI variables, and credentials that never expire.

## Verification
Confirm identity binding, least privilege, rotation, revocation, and cross-environment isolation.

## Expected output
Workload identity inventory, target authentication pattern, permission model, lifecycle controls, and migration plan.

## Stop conditions
Escalate when a workload cannot rotate credentials safely or required permissions cannot be constrained.