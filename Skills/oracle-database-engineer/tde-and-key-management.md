# TDE and Key Management

## Purpose
Deploy and operate Oracle Transparent Data Encryption with protected key lifecycle, recoverable wallets/keystores, and tested backup/restore behavior.

## When to use
Use for encryption-at-rest requirements, key rotation, migration, wallet incidents, or compliance reviews.

## Inputs
Data classification, encryption requirements, Oracle version, keystore architecture, HSM/KMS options, backup and DR design.

## Context to inspect
Tablespace/column encryption, wallet/keystore state, master keys, auto-login implications, key backups, standby configuration, RMAN encryption, and access controls.

## Core knowledge
Encrypted data is unrecoverable without required keys. TDE protects storage media but does not replace authorization, network encryption, or application security.

## Procedure
1. Define encryption scope from data classification and policy.
2. Select software keystore or HSM/KMS architecture.
3. Restrict keystore administration and separate duties where required.
4. Back up keystore material before encryption or rotation operations.
5. Enable encryption using supported low-risk migration procedures.
6. Validate standby, backup, clone, and recovery workflows.
7. Rotate master keys according to policy and record provenance.
8. Monitor wallet state and startup dependencies.
9. Test recovery from independent key backups.
10. Document emergency key-access procedures.

## Decision points
Prefer tablespace encryption for broad coverage; use column encryption only when its semantic/operational tradeoffs are justified. Auto-login wallets improve availability but reduce one protection boundary.

## Common failure patterns
No wallet backup, key copies on same failure domain, untested standby access, assuming TDE protects SQL users, and rotating keys without recovery validation.

## Verification
Restore encrypted backups to an isolated environment using documented keystore recovery procedures.

## Expected output
A tested encryption and key-lifecycle implementation.

## Stop conditions
Stop any destructive key change when verified backup/recovery of the keystore is absent.