# Secret Manager and Key Management

## Purpose
Protect credentials and cryptographic keys using Secret Manager, Cloud KMS, IAM separation, rotation, and audit controls.

## When to use
Use when applications need secrets, customer-managed encryption keys, key rotation, or credential-remediation work.

## Inputs
Secret owners, consumers, rotation period, compliance requirements, encryption scope, and recovery needs.

## Context to inspect
Secret versions, IAM bindings, replication policy, KMS key rings, key versions, rotation schedules, service agents, and audit logs.

## Core knowledge
Secrets and encryption keys have different lifecycle semantics. CMEK adds control and operational responsibility; disabling or deleting keys can make dependent data unavailable.

## Procedure
1. Inventory secrets and encryption requirements.
2. Remove credentials from source and images.
3. Create least-privilege Secret Manager access.
4. Use runtime identity to retrieve secrets.
5. Configure rotation with overlap and rollback.
6. Use KMS only where explicit key control is required.
7. Separate key administration from key use.
8. Map key dependencies before rotation or destruction.
9. Monitor secret access and key operations.
10. Rehearse rotation and recovery.

## Decision points
Prefer Google-managed encryption unless regulation or threat model requires CMEK. Prefer short-lived federated credentials over storing reusable secrets.

## Common failure patterns
Secrets in environment dumps, broad accessor roles, key deletion without dependency inventory, and rotation without dual-version support.

## Verification
Scan repositories/images, test access denial, rotate a credential safely, and inspect audit logs.

## Expected output
A credential and key lifecycle with documented ownership.

## Stop conditions
Stop before key destruction or irreversible rotation when dependency evidence is incomplete.