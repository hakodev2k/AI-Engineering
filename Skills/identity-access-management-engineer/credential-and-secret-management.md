# Credential and Secret Management

## Purpose
Protect passwords, API keys, certificates, client secrets, and recovery credentials throughout creation, storage, use, rotation, and revocation.

## When to use
Use for secret-store design, credential incidents, application onboarding, certificate rotation, or eliminating hard-coded credentials.

## Inputs
Credential inventory, workloads, secret stores, rotation capabilities, consumers, deployment process, and incident requirements.

## Context to inspect
Inspect repositories, CI/CD variables, configuration, vaults, certificate stores, environment variables, logs, backups, rotation jobs, and access policies.

## Core knowledge
Secrets should be minimized, scoped, centrally protected, rotated, and observable. The best static secret is one that can be replaced with short-lived identity. Rotation is an operational workflow, not merely a policy date.

## Procedure
1. Discover credential locations and owners.
2. Classify credentials by privilege and exposure impact.
3. Replace static secrets with managed/federated identity where feasible.
4. Move remaining secrets to an approved secret store.
5. Restrict read and administrative access separately.
6. Define generation strength and lifetime.
7. Automate dual-safe rotation where consumers permit it.
8. Prevent secrets from entering logs, source, artifacts, and tickets.
9. Monitor access and failed rotation.
10. Test emergency revocation and recovery.

## Decision points
Use short-lived credentials whenever supported. Rotation frequency should reflect exposure and automation capability; frequent manual rotation can increase outages without improving control.

## Common failure patterns
Secrets in source control, shared credentials, plaintext CI variables, rotation without consumer coordination, backups containing old active secrets, excessive vault readers, and logging tokens.

## Verification
Run secret scanning, inspect effective vault permissions, rotate representative credentials, and confirm old credentials stop working without service outage.

## Expected output
A credential-control design with inventory, storage, least privilege, rotation, monitoring, and revocation evidence.

## Stop conditions
Escalate when exposed high-privilege credentials cannot be revoked promptly or a critical consumer cannot support safe rotation.