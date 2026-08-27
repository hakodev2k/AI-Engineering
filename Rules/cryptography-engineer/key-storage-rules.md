# Key Storage Rules

## Purpose
Protect secret key material throughout storage and use.

## Scope
Application secrets, private keys, master keys, wrapping keys, and cryptographic seeds.

## MUST
- Store secret keys only in approved secret, key-management, or hardware-backed systems with access control and auditability.
- Restrict key access by least privilege and separate administrative from cryptographic-use permissions.
- Encrypt exported key material under an approved wrapping mechanism.

## MUST NOT
- Store plaintext keys in source control, images, logs, tickets, client bundles, or general-purpose configuration.
- Expose private key material merely for operational convenience.

## SHOULD
- Prefer non-exportable keys for high-impact trust anchors.

## Exceptions
Exportability requires documented operational need, protected transport/storage, accountable custody, and approval.

## Verification
Inspect repositories, secret scans, IAM policies, key attributes, audit logs, backups, and deployment configuration.