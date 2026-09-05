# Encryption and Secret Rules

## Purpose
Protect message confidentiality and credentials throughout transport, storage, and client configuration.

## Scope
TLS, encryption at rest, client secrets, certificates, keys, and credential rotation.

## MUST
- Sensitive messaging traffic MUST use authenticated encryption in transit.
- Secrets and private keys MUST be stored in approved secret-management systems, not source code or ordinary config.
- Credential and certificate rotation MUST have a tested procedure that avoids unnecessary downtime.
- Encryption requirements MUST match the sensitivity and regulatory classification of message data.

## MUST NOT
- MUST NOT log credentials, tokens, private keys, or unredacted secret material.
- MUST NOT disable TLS verification to solve connectivity problems in production.
- MUST NOT rotate production credentials destructively without required approval and rollback preparation.

## SHOULD
- Prefer automated short-lived credentials and certificate renewal.

## Exceptions
Cryptographic exceptions require security review, compensating controls, expiry, and approval.

## Verification
Inspect TLS settings, secret references, scanners, certificate expiry monitoring, and rotation tests.