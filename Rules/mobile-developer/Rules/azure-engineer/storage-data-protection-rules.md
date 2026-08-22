# Storage and Data Protection Rules

## Purpose
Protect Azure-hosted data through deliberate durability, access, lifecycle, and encryption controls.

## Scope
Storage accounts, Blob, Files, queues, disks, replication, encryption, lifecycle, immutability, and public access.

## MUST
- Classify stored data and select durability, replication, retention, and access controls accordingly.
- Disable anonymous or public access unless explicitly required and reviewed.
- Use secure transport and supported encryption controls.
- Define lifecycle and deletion behavior for material datasets.
- Assess application consistency when changing replication or storage tiers.

## MUST NOT
- Expose storage account keys where identity-based access is available and suitable.
- Delete production data or containers without verified scope, backup/recovery consideration, and approval.
- Assume geo-redundancy is a backup strategy.

## SHOULD
- Prefer identity-based authorization and scoped delegation over account-level credentials.
- Use lifecycle policies for predictable archival and deletion.

## Exceptions
Exceptions require data owner, security rationale, duration, controls, and approval.

## Verification
Inspect storage configuration, access settings, encryption, replication, lifecycle policies, identities, logs, and recovery settings.