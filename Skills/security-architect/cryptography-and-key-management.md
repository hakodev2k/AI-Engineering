# Cryptography and Key Management

## Purpose
Choose and govern cryptographic controls so confidentiality, integrity, authenticity, and key custody requirements are met without fragile custom designs.

## When to use
Use for encryption, signing, certificate, token, key-management, and protected-channel architecture.

## Inputs
Data classification, threat model, protocol requirements, compliance constraints, platform capabilities, key ownership, recovery needs.

## Preconditions
Protected assets, trust relationships, and required cryptographic properties are known.

## Context to inspect
TLS termination, certificate authorities, KMS/HSM services, key rotation, application secrets, backups, signing services, and recovery procedures.

## Core knowledge
Cryptographic strength depends on protocol design, implementation, key lifecycle, randomness, identity binding, and operational custody. Custom cryptography is rarely justified.

## Procedure
1. Identify the property required: confidentiality, integrity, authenticity, or nonrepudiation.
2. Select approved algorithms and protocols through platform standards.
3. Define key generation, storage, use, rotation, revocation, and destruction.
4. Separate key administration from data access where risk warrants it.
5. Protect key material in transit, backup, and recovery workflows.
6. Define certificate issuance and renewal automation.
7. Plan algorithm and key-size migration.
8. Specify audit events for key and certificate operations.
9. Test expiry, revocation, rotation, and recovery scenarios.

## Decision points
Prefer managed KMS or HSM capabilities for centralized custody. Use application-level encryption only when storage-level protection does not meet the threat model.

## Common failure patterns
Hard-coded keys, unmanaged certificates, static secrets, custom crypto, missing rotation tests, and recovery mechanisms that bypass intended controls.

## Verification
Confirm approved algorithms, key isolation, rotation, revocation, certificate renewal, recovery, and audit evidence.

## Expected output
A cryptographic architecture with protocol choices, key lifecycle, trust anchors, ownership, and migration strategy.

## Stop conditions
Stop when regulatory algorithm requirements are unclear, key ownership is unresolved, or recovery requirements conflict with custody controls.