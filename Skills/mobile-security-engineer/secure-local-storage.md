# Secure Local Storage

## Purpose
Protect credentials, tokens, personal data, cryptographic material, and sensitive application state stored on mobile devices.

## When to use
Use when adding or reviewing persisted sensitive data, caches, databases, preferences, files, backups, or offline features.

## Inputs
Data classification, storage schema, retention rules, platform target, authentication model, backup behavior.

## Preconditions
Know which data truly requires persistence and the consequences of disclosure or tampering.

## Context to inspect
Keychain/Keystore usage, files, SQLite databases, preferences, caches, logs, backups, shared containers, screenshots and clipboard interactions.

## Core knowledge
Minimize stored sensitive data. Prefer OS-protected credential stores for secrets. Encryption is only as strong as key management. Device compromise may defeat client-side controls, so avoid treating local secrecy as an authorization boundary.

## Procedure
1. Inventory persisted data.
2. Classify confidentiality, integrity, retention, and availability needs.
3. Eliminate unnecessary persistence.
4. Select platform-protected storage for secrets.
5. Define encryption and key lifecycle where needed.
6. Exclude sensitive artifacts from backups and logs.
7. Define logout, account-switch, uninstall, and expiration cleanup.
8. Test locked-device and compromised-state behavior.
9. Verify migrations preserve protections.

## Decision points
Use platform credential stores for small secrets; encrypted databases/files for larger sensitive datasets when justified. Do not add custom encryption when platform primitives meet the threat model.

## Common failure patterns
Plaintext tokens, hard-coded keys, sensitive preferences, backup leakage, stale caches after logout, weak key derivation, and assuming database encryption prevents runtime extraction.

## Verification
Inspect application data on test devices, backup artifacts, logs, and migration paths. Confirm secrets are unavailable outside intended authentication states.

## Expected output
A minimized, classified storage design with appropriate platform protections and lifecycle tests.

## Stop conditions
Escalate if retention obligations conflict with security requirements or key custody cannot be defined safely.