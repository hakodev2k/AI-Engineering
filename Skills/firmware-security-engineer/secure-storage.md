# Secure Storage

## Purpose
Protect firmware secrets and security state at rest against unauthorized software access, offline extraction, rollback, corruption, and unsafe erase behavior.

## When to use
Use for credentials, keys, counters, configuration, user secrets, calibration security data, or persistent authorization state.

## Inputs
Asset classification, flash/EEPROM layout, hardware secure storage, encryption engines, key hierarchy, wear limits, power-failure model, and lifecycle requirements.

## Preconditions
Determine whether confidentiality, integrity, authenticity, freshness, secure deletion, or combinations are required for each stored object.

## Context to inspect
Storage drivers, partitions, key derivation, nonce generation, metadata, journaling, wear leveling, backup copies, factory reset, RMA, crash dumps, and update interactions.

## Core knowledge
Encryption without integrity permits tampering; authenticated encryption without freshness permits rollback if old ciphertext can be restored. Nonces must satisfy the selected AEAD requirements. Device-bound key derivation limits cloning. Flash erase and wear behavior constrain secure deletion and counters.

## Procedure
1. Inventory persistent security-sensitive objects.
2. Define confidentiality, integrity, freshness, availability, and retention needs.
3. Minimize stored secrets and derive scoped keys from hardware roots where possible.
4. Use authenticated encryption for confidential mutable records.
5. Bind record type, device identity, version, and location as associated data when appropriate.
6. Provide rollback protection for counters/policies using monotonic hardware or authenticated version state.
7. Design atomic writes and recovery for power interruption.
8. Bound wear from counters and journaling.
9. Restrict read/write APIs by privilege and lifecycle state.
10. Sanitize secrets on decommission/factory reset consistent with storage physics.
11. Test cloning, bit corruption, replay of old sectors, interrupted writes, full storage, and key loss.

## Decision points
Use secure-element storage for high-value small secrets; encrypted flash suits larger state when keys are hardware-bound. Journaling improves recovery but creates old copies that matter for confidentiality and rollback.

## Common failure patterns
Static encryption keys in firmware; reused AEAD nonces; CRC treated as authentication; encrypted records replayable from backups; secrets copied into logs/dumps; factory reset deleting indexes but not sensitive data; wear-out of security counters.

## Verification
Inspect raw storage to ensure secrets are not plaintext, replay old valid records and confirm rejection where freshness matters, corrupt records and verify fail-secure behavior, inject resets during writes, and test factory reset/decommissioning.

## Expected output
Storage threat model, protected record design, implementation, fault tests, lifecycle behavior, and residual physical assumptions.

## Stop conditions
Escalate when required freshness cannot be anchored, flash endurance is inadequate, key derivation roots are unavailable, or secure deletion claims cannot be supported by the hardware.