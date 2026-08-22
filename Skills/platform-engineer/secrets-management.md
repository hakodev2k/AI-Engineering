# Secrets Management

## Purpose
Provide safe storage, distribution, rotation, and revocation of secrets used by platform workloads.

## When to use
Use whenever credentials, keys, certificates, or sensitive configuration are required.

## Inputs
Secret consumers, identity model, secret stores, rotation constraints, and incident requirements.

## Context to inspect
Repositories, pipelines, runtime injection, logs, backups, permissions, rotation, and existing static credentials.

## Core knowledge
Secrets should be minimized; prefer identity federation when possible. Remaining secrets need encryption, least privilege, short exposure, rotation, and audit.

## Procedure
1. Inventory secrets and consumers.
2. Eliminate secrets replaceable by managed identity.
3. Centralize remaining secrets in approved stores.
4. Authenticate consumers without embedding bootstrap secrets where possible.
5. Scope access narrowly.
6. Prevent secrets in source, logs, and artifacts.
7. Automate rotation and test consumer reload behavior.
8. Define emergency revocation.

## Decision points
Choose dynamic credentials when supported; static secrets are a fallback with stronger rotation requirements.

## Common failure patterns
Secrets in Git, shared credentials, manual rotation, broad read access, plaintext CI variables, and logging secret values.

## Verification
Secret scanning passes, unauthorized reads fail, rotation succeeds without outage, and access is auditable.

## Expected output
A secrets lifecycle with storage, access, rotation, detection, and revocation controls.

## Stop conditions
Escalate exposed production secrets immediately or when rotation cannot be performed safely.