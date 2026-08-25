# Key Lifecycle, Rotation, and Destruction

## Purpose
Operate cryptographic keys safely from activation through rotation, revocation, archival, compromise response, and destruction.

## When to use
Use when defining key policy, implementing rotation, responding to compromise, or retiring systems and tenants.

## Inputs
Key inventory, purpose, cryptoperiod, dependencies, stored ciphertext/signatures, recovery objectives, and regulatory retention rules.

## Context to inspect
Key versions, aliases, consumers, caches, backups, replicas, certificate chains, deployment sequencing, audit logs, and recovery procedures.

## Core knowledge
Rotation is a distributed migration, not merely creation of a new key. Encryption keys may need old versions for decryption; signing verification may require historical public material. Destruction must account for replicas and backups while respecting retention and recovery needs.

## Procedure
1. Inventory key versions and consumers.
2. Define states: pre-active, active, decrypt/verify-only, revoked, archived, destroyed.
3. Establish rotation and emergency triggers.
4. Create and validate the successor key.
5. Deploy readers/verifiers before switching writers/signers.
6. Change active aliases or versions atomically where possible.
7. Re-encrypt data only when justified and safely resumable.
8. Monitor failures and stale consumers.
9. Revoke compromised material and execute incident procedures.
10. Destroy keys only after retention, recovery, and dependency checks.

## Decision points
Use lazy re-encryption for large datasets when immediate migration is unnecessary; eager migration when compromise or policy demands it. Scheduled rotation does not replace event-driven rotation after suspected exposure.

## Common failure patterns
Deleting old keys too early; rotating writers before readers; hard-coded key IDs; no compromise path; backups retaining unexpected key copies; rotation without observability.

## Verification
Test old/new interoperability, stale consumer detection, rollback, recovery, revocation, and destruction evidence. Confirm no active dependency references retired material.

## Expected output
A versioned key lifecycle plan with safe rotation sequence, compromise handling, retention, and destruction evidence.

## Stop conditions
Stop before irreversible revocation or destruction if dependencies, legal retention, recovery impact, or ownership are uncertain.