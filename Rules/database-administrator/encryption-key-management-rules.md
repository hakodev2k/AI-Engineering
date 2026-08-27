# Encryption and Key Management

## Purpose
Protect database data while ensuring encrypted systems remain recoverable.

## Scope
Encryption at rest, in transit, backup encryption, certificates, keys, and rotation dependencies.

## MUST
- Sensitive database traffic MUST use approved transport protection when crossing untrusted or shared boundaries.
- Encryption keys MUST be stored separately from encrypted data where the platform permits and protected by least privilege.
- Key rotation and certificate renewal MUST be planned so replicas, backups, clients, and recovery procedures remain functional.
- Recovery testing MUST verify required key material is available through authorized mechanisms.

## MUST NOT
- MUST NOT place private keys or master secrets in source control, tickets, logs, or plaintext scripts.
- MUST NOT rotate or revoke production keys without an impact and recovery plan plus required approval.
- MUST NOT claim encryption protects data if privileged bypass paths remain undocumented.

## SHOULD
- Key usage SHOULD be auditable.
- Automated expiry monitoring SHOULD cover certificates and key dependencies.

## Exceptions
Exceptions require security review, risk owner, compensating controls, and expiry.

## Verification
Inspect TLS settings, key permissions, certificate validity, rotation records, recovery tests, secret scanning, and audit logs.