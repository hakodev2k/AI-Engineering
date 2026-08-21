# Secrets and Key Management

## Purpose
Protect credentials, cryptographic keys, certificates, and other sensitive configuration throughout creation, storage, distribution, rotation, and revocation.

## When to use
Use when introducing credentials, reviewing secret exposure, designing service authentication, handling certificates, or responding to leaked secrets.

## Inputs
Secret inventory, identity model, deployment environment, key stores, applications, rotation requirements, incident history.

## Context to inspect
Configuration files, CI/CD variables, source control history, environment variables, secret managers, certificates, managed identities, logging, backups, and access policies.

## Core knowledge
Secrets should be minimized, scoped, short-lived where possible, and delivered through controlled channels. Prefer workload identity or managed identity over static credentials. Cryptographic keys require lifecycle controls separate from ordinary configuration.

## Procedure
1. Inventory secrets and keys by owner, consumer, scope, and sensitivity.
2. Remove unnecessary static credentials.
3. Store remaining secrets in an approved secret-management system.
4. Restrict read and administrative access separately.
5. Prefer runtime retrieval or secure injection over embedding in artifacts.
6. Define rotation, expiration, revocation, and emergency replacement procedures.
7. Prevent secret values from entering logs, telemetry, tests, or source control.
8. Scan repositories and build artifacts for accidental exposure.
9. Test rotation without application downtime when required.
10. Document compromise-response steps.

## Decision points
Use managed/workload identities when the platform supports them. Use static secrets only when the external system cannot support stronger identity mechanisms.

## Common failure patterns
Secrets in source control, broad vault permissions, shared credentials, no rotation process, logging tokens, copying production secrets into test environments, and treating encryption keys like normal config.

## Verification
Repository and artifact scans show no exposed secrets, access policies follow least privilege, rotation succeeds, revoked credentials stop working, and audit logs capture sensitive access.

## Expected output
A controlled secret and key lifecycle with reduced static credential usage, enforceable access boundaries, and tested rotation/revocation.

## Stop conditions
Escalate immediately for active credential exposure, unavailable revocation capability, or key changes that could make protected data unrecoverable.