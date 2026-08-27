# Storage Security and Encryption

## Purpose
Protect stored data through least privilege, encryption, key management, isolation, auditability, and secure lifecycle controls.

## When to use
Use for new storage, security reviews, regulated data, multi-tenant platforms, migrations, or suspected access exposure.

## Inputs
Data classification, identities, access requirements, encryption capabilities, KMS/HSM design, audit requirements, network topology, and retention/deletion policy.

## Context to inspect
ACLs/IAM, export policies, LUN masking, bucket policies, encryption state, key rotation, service accounts, audit logs, snapshots, replicas, and backups.

## Core knowledge
Encryption at rest does not replace authorization. Keys must be protected separately from ciphertext. Copies, snapshots, caches, and backups inherit sensitivity. Secure deletion semantics vary by medium and encryption design.

## Procedure
1. Classify datasets and regulatory obligations.
2. Enumerate principals and required actions.
3. Apply least-privilege access and tenant isolation.
4. Encrypt data in transit and at rest where required.
5. Define key ownership, rotation, revocation, and recovery.
6. Restrict management-plane access.
7. Enable tamper-resistant audit logging.
8. Review snapshot/replica/backup access equivalently.
9. Test denied paths and key-loss/revocation scenarios.
10. Define secure decommission and deletion process.

## Decision points
Use platform-managed keys for operational simplicity when policy allows; customer-managed/HSM-backed keys when separation, revocation, or compliance requires it. Prefer identity-based controls over shared credentials.

## Common failure patterns
Public or broad exports, encryption keys beside data, stale service accounts, unencrypted replicas, sensitive test clones, and assuming deletion immediately sanitizes media.

## Verification
Perform access reviews, negative authorization tests, encryption/key-state checks, audit-log validation, and recovery tests for key-management procedures.

## Expected output
Access matrix, encryption/key design, audit controls, identified gaps, and remediation evidence.

## Stop conditions
Escalate suspected exposure, unknown data classification, unavailable key recovery, or changes that could irreversibly revoke production access.