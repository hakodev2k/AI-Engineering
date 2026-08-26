# Cryptographic Key Management

## Purpose
Manage mobile cryptographic keys through secure generation, storage, use, rotation, invalidation, and recovery.

## When to use
Use for encrypted local data, signing, device binding, passkeys, client certificates, or cryptographic protocol integration.

## Inputs
Threat model, key purposes, platform capabilities, recovery requirements, server protocol, data lifecycle.

## Preconditions
Define what each key protects and whether confidentiality, integrity, authenticity, or non-exportability is required.

## Context to inspect
Keychain/Keystore/Secure Enclave usage, key aliases, access controls, backup behavior, attestation, rotation, and migration code.

## Core knowledge
Keys need explicit lifecycle and scope. Prefer platform hardware-backed/non-exportable storage when it materially addresses the threat model. Never hard-code production secrets in apps.

## Procedure
1. Inventory keys and purposes.
2. Remove shared or embedded secrets where possible.
3. Select appropriate platform key protection.
4. Define generation parameters and access controls.
5. Bind sensitive use to authentication when justified.
6. Define rotation, revocation, migration, and loss behavior.
7. Separate keys by purpose and environment.
8. Test device restore, biometric changes, reinstall, and key invalidation.

## Decision points
Use hardware-backed keys when non-exportability matters and supported. Avoid device-only keys when account recovery requires portable encrypted data unless a recovery design exists.

## Common failure patterns
Hard-coded keys, one key for all purposes, indefinite lifetime, exporting private keys, undocumented backup behavior, and unrecoverable encryption.

## Verification
Inspect key attributes on devices and exercise lifecycle events to prove expected availability and invalidation.

## Expected output
A documented key lifecycle with platform-backed controls and recovery/rotation tests.

## Stop conditions
Escalate when cryptographic requirements are undefined or key loss/recovery consequences are unacceptable.