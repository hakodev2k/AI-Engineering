# Secrets Management

## Purpose
Protect credentials and sensitive configuration throughout Kubernetes secret creation, storage, delivery, rotation, and revocation.

## When to use
Use when workloads need credentials, certificates, API keys, encryption keys, or other sensitive configuration.

## Inputs
Secret inventory, consumers, rotation requirements, KMS/external-secret capabilities, RBAC, backup design, and incident requirements.

## Preconditions
Classify secrets and identify authoritative secret stores and owners.

## Context to inspect
Inspect etcd encryption, RBAC to Secret objects, service-account tokens, environment variables, mounted files, CSI/external secret integrations, logs, Git history, backups, and node exposure.

## Core knowledge
Base64 is not encryption. Kubernetes Secrets reduce accidental exposure but require encryption, access control, rotation, and careful delivery. Secret material can leak through manifests, process environments, logs, dumps, and backups.

## Procedure
1. Inventory secrets and consumers.
2. Remove secrets from source control and images.
3. Restrict read permissions.
4. Enable appropriate at-rest encryption/KMS.
5. Prefer short-lived or dynamically issued credentials when supported.
6. Select delivery mechanism based on application/runtime constraints.
7. Define rotation and revocation workflows.
8. Test rotation without outage.
9. Monitor access and anomalous reads.

## Decision points
Prefer external secret authority for centralized lifecycle control; use native Secrets where operational simplicity outweighs added integration and controls remain adequate.

## Common failure patterns
Long-lived credentials; broad secret reads; secrets in env dumps; untested rotation; committing encoded secrets; backups without equivalent protection.

## Verification
Confirm unauthorized identities cannot read secrets, storage is encrypted as designed, rotation succeeds, and old credentials are invalidated.

## Expected output
A documented, least-privilege secret lifecycle with tested rotation and recovery.

## Stop conditions
Escalate immediately for suspected credential exposure or when required encryption/rotation controls are unavailable.