# Encryption and Key Management Rules

## Purpose
Protect personal data against unauthorized disclosure in storage and transit.

## Scope
Applies to databases, object storage, queues, backups, exports, network transport, application secrets, and encryption keys.

## MUST
- Sensitive personal data MUST use approved encryption in transit and at rest where the threat model requires it.
- Encryption keys MUST be stored and managed separately from encrypted data with least-privilege access.
- Key rotation, revocation, backup, and recovery procedures MUST be defined for production systems.
- Cryptographic configuration MUST use maintained algorithms, modes, and libraries approved by project security requirements.

## MUST NOT
- Encryption keys MUST NOT be hard-coded in source code, images, configuration committed to version control, or logs.
- Custom cryptographic algorithms MUST NOT be introduced without specialist review.
- Encryption MUST NOT be represented as eliminating authorization, retention, or minimization obligations.

## SHOULD
- High-risk data SHOULD use scoped keys to reduce blast radius where operationally practical.
- Key access SHOULD produce auditable events without exposing key material.

## Exceptions
Any weakening of required encryption or key controls requires documented threat analysis, compensating controls, duration, and security approval.

## Verification
Inspect transport configuration, storage encryption, key-manager policies, source scans, rotation records, recovery tests, and security scanner findings.