# Data Protection Architecture

## Purpose
Design controls for sensitive data throughout collection, processing, storage, sharing, retention, and deletion.

## When to use
Use for systems handling confidential, regulated, customer, employee, financial, or security-sensitive data.

## Inputs
Data inventory, classification, data flows, retention rules, regulatory obligations, access model, storage technologies, integration map.

## Preconditions
Data owners and major processing purposes are identifiable.

## Context to inspect
Databases, object stores, caches, backups, analytics copies, logs, message systems, exports, encryption, tokenization, and deletion workflows.

## Core knowledge
Data protection requires minimizing collection and exposure, controlling access, protecting cryptographic material, and managing copies across the full lifecycle. Encryption alone does not solve overcollection or excessive access.

## Procedure
1. Inventory sensitive data and processing purposes.
2. Map data flows, replicas, transformations, and exports.
3. Define classification-linked protection requirements.
4. Minimize collection, retention, and privilege.
5. Select encryption, tokenization, masking, or segregation controls as appropriate.
6. Define key ownership and lifecycle.
7. Protect backups, logs, and nonproduction copies.
8. Design deletion and retention enforcement.
9. Specify monitoring for sensitive-data access and transfer.
10. Validate third-party handling and contractual boundaries.

## Decision points
Use tokenization or irreversible transformation when consumers do not need original values. Prefer field-level controls only when their complexity is justified by risk.

## Common failure patterns
Protecting primary databases but not backups, copying production data into test environments, indefinite retention, weak key separation, and undocumented exports.

## Verification
Trace representative sensitive records across lifecycle stages and confirm access, protection, retention, and deletion controls work as designed.

## Expected output
A data protection architecture with lifecycle controls, cryptographic boundaries, owners, and verification criteria.

## Stop conditions
Stop when data classification is disputed, retention requirements conflict, or lawful processing constraints require specialist review.