# Secrets and Key Management

## Purpose
Protect credentials, cryptographic keys, certificates, and sensitive configuration throughout their lifecycle.

## When to use
Use for workload authentication, encryption, certificate management, CI/CD, and secret-rotation design.

## Inputs
Secret inventory, consumers, key ownership, rotation requirements, vault/KMS capabilities.

## Context to inspect
Source repositories, pipelines, environment variables, secret stores, access policies, certificates, rotation jobs, audit logs.

## Core knowledge
Secrets should be centrally controlled, minimally distributed, short-lived where possible, auditable, and rotatable without disruptive manual work.

## Procedure
1. Inventory secret and key material.
2. Remove secrets from source and images.
3. Select managed vault/KMS services.
4. Grant consumers narrowly scoped access.
5. Prefer workload identity over stored credentials.
6. Define generation, storage, rotation, revocation, and recovery.
7. Automate certificate renewal.
8. Protect key deletion and privileged operations.
9. Enable access auditing.
10. Test rotation and emergency revocation.

## Decision points
Use provider-managed keys by default; use customer-managed keys when separation, compliance, or revocation requirements justify operational burden.

## Common failure patterns
Shared secrets, never-rotated keys, plaintext pipeline variables, secrets copied to laptops, expired certificates, and rotation without consumer coordination.

## Verification
Rotate a representative credential and verify services continue correctly while old credentials become unusable.

## Expected output
A managed secret lifecycle with minimal standing credentials.

## Stop conditions
Escalate unrecoverable key ownership ambiguity or destructive key changes affecting protected data.