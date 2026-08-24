# KMS Key Management

## Purpose
Design safe cloud cryptographic key ownership, policy, rotation, and recovery using managed key-management services.

## When to use
Use for sensitive-data encryption, customer-managed keys, cross-account encryption, key-policy review, or cryptographic incidents.

## Inputs
Data classification, encryption requirements, key policies, resource integrations, compliance requirements, and recovery objectives.

## Context to inspect
Inspect key administrators, key users, grants, aliases, rotation, deletion windows, replicas, audit logs, and dependent resources.

## Core knowledge
Separate key administration from key use. Key policy is an authorization boundary; deletion and disablement can cause irreversible availability loss.

## Procedure
1. Classify protected data and threat model.
2. Choose provider-managed or customer-managed keys based on control requirements.
3. Define narrow administrators and users.
4. Restrict key use by service/resource conditions where supported.
5. Configure rotation and lifecycle controls.
6. Protect deletion and disable operations.
7. Enable audit logging and anomaly alerts.
8. Test encryption, decryption, rotation, and recovery.

## Decision points
Use customer-managed keys when policy control, revocation, separation, or compliance justifies operational cost; otherwise prefer managed defaults.

## Common failure patterns
Overbroad key policies, single-person administration, premature deletion, untested cross-region recovery, and assuming key rotation re-encrypts all historical data.

## Verification
Review effective key policy, test authorized/unauthorized operations, confirm audit events, and validate dependent-service recovery.

## Expected output
A key design with justified ownership, lifecycle controls, and recovery evidence.

## Stop conditions
Stop before destructive key actions without impact analysis, backups where applicable, and explicit approval.