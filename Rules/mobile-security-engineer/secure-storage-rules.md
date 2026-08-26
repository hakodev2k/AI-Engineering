# Secure Storage Rules

## Purpose
Prevent unauthorized disclosure or modification of sensitive data stored on mobile devices.

## Scope
Credentials, keys, personal data, caches, databases, preferences, files, backups, and shared storage.

## MUST
- Classify sensitive local data and select storage controls based on confidentiality, integrity, persistence, and accessibility requirements.
- Use platform-protected credential/key storage for secrets and cryptographic keys.
- Ensure sensitive files and databases are excluded from unintended backup, sharing, indexing, or synchronization when required.
- Delete sensitive local material when its retention purpose ends.

## MUST NOT
- Store credentials, private keys, or reusable tokens in plaintext application files or generic preferences.
- Assume application sandboxing alone protects data on a compromised device.
- Persist sensitive data merely for implementation convenience.

## SHOULD
- Minimize local retention and cache only what is operationally necessary.
- Prefer hardware-backed key protection when available and appropriate.

## Exceptions
Exceptions require data classification, retention rationale, threat analysis, compensating controls, and approval.

## Verification
Inspect application containers, backups, databases, preferences, shared storage, and key stores on representative devices and lifecycle states.