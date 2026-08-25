# Storage Security

## Purpose
Protect stored data and storage control planes through least privilege, encryption, segmentation, secure administration, and auditable change control.

## When to use
Use for storage onboarding, security review, incident remediation, credential redesign, or compliance work.

## Inputs
Data classification, identities, protocols, topology, encryption requirements, admin model, audit requirements, and threat model.

## Preconditions
Identify privileged paths and recovery credentials; avoid changes that could lock out recovery access.

## Context to inspect
IAM/RBAC, service accounts, export/share ACLs, SAN zoning, network controls, encryption at rest/in transit, KMS/HSM, admin interfaces, logs, and backup credentials.

## Core knowledge
Storage is a high-value blast-radius domain. Separate data-plane and control-plane privilege, minimize shared credentials, protect keys independently, and make destructive actions auditable.

## Procedure
1. Classify data and threat scenarios.
2. Inventory identities and privileges.
3. Remove unnecessary broad access.
4. Segment management and data paths.
5. Enable appropriate transport and at-rest encryption.
6. Define key ownership, rotation, and recovery.
7. Harden management interfaces and MFA.
8. Protect backup/snapshot deletion paths.
9. Enable immutable/auditable logs where feasible.
10. Test authorized and unauthorized access paths.

## Decision points
Use storage-native encryption when it meets threat requirements; add application/client-side encryption when provider/admin trust must be reduced. Encryption does not replace authorization.

## Common failure patterns
Shared admin accounts, public buckets, wildcard exports, keys stored with data, unaudited deletion, stale service accounts, and backups reachable by compromised production credentials.

## Verification
Access tests, policy review, key-recovery drill, audit-log validation, and vulnerability/configuration checks confirm intended boundaries.

## Expected output
A hardened storage security baseline with access matrix, encryption/key policy, audit evidence, and remediation record.

## Stop conditions
Escalate security-impacting changes requiring approval, missing key-recovery procedures, or evidence of active compromise.
