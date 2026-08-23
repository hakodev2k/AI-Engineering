# Secrets and Credential Management

## Purpose
Design secure storage, issuance, rotation, revocation, and operational handling of passwords, API keys, certificates, and cryptographic credentials.

## When to use
Use when introducing secret stores, rotating credentials, reviewing leaks, or removing embedded secrets.

## Inputs
Credential types, consumers, runtime environments, rotation windows, vault capabilities, recovery requirements.

## Context to inspect
Repositories, CI/CD variables, configuration stores, vaults, certificates, key ownership, rotation jobs, incident procedures.

## Core knowledge
Secrets are liabilities whose exposure grows with lifetime, distribution, privilege, and copy count. Prefer ephemeral identity over persistent secrets where possible.

## Procedure
1. Inventory secret types, owners, consumers, and privileges.
2. Remove secrets from code and images.
3. Centralize storage in an approved secret manager.
4. Restrict retrieval by workload identity and environment.
5. Set lifetimes and automated rotation.
6. Define dual-secret or overlap strategies for zero-downtime rotation.
7. Log access without logging secret values.
8. Scan for accidental exposure.
9. Define emergency revocation and replacement.
10. Test rotation and recovery before production reliance.

## Decision points
Use dynamic credentials when supported; use static credentials only where required and compensate with tighter scope and faster rotation.

## Common failure patterns
Secrets in source control, broad vault access, manual rotation, shared keys, expired certificates, and secret values emitted to logs.

## Verification
Rotate representative credentials, revoke old values, verify consumers recover, and inspect audit events.

## Expected output
Secret inventory, storage policy, rotation design, access policy, and incident playbook.

## Stop conditions
Escalate if a critical consumer cannot tolerate rotation or leaked credentials cannot be revoked.