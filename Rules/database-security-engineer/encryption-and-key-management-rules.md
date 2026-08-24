# Encryption and Key Management Rules

## Purpose
Protect database confidentiality with correctly scoped cryptography and controlled key lifecycles.

## Scope
Applies to data at rest, backups, replicas, exports, transport, application/database encryption, and cryptographic keys.

## MUST
- Sensitive database traffic MUST use authenticated encryption in transit.
- Sensitive persistent data and backups MUST use encryption at rest appropriate to classification and threat model.
- Key custody MUST be separated from encrypted data where practical.
- Key access MUST be least-privileged, auditable, and recoverable according to continuity requirements.
- Rotation, revocation, backup, and recovery procedures MUST be defined before production reliance on a key.

## MUST NOT
- Custom cryptographic algorithms or unaudited encryption schemes MUST NOT be introduced.
- Production keys MUST NOT be stored alongside data solely as plaintext configuration.
- Key deletion or rotation with irreversible data impact MUST NOT occur without explicit human approval and recovery evidence.

## SHOULD
- Prefer managed KMS/HSM capabilities and envelope encryption where appropriate.
- Cryptographic choices SHOULD follow current organizational and regulatory standards.

## Exceptions
Exceptions require threat analysis, alternative controls, expiry, and security approval.

## Verification
Inspect TLS settings, certificate validation, storage encryption, KMS policies, key audit logs, backup metadata, and recovery tests. Verify clients reject invalid server identity where applicable.