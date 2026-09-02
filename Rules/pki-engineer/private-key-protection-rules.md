# Private Key Protection

## Purpose
Prevent unauthorized disclosure, duplication, or use of private keys.

## Scope
Applies to private keys throughout storage, use, backup, transport, rotation, and destruction.

## MUST
- Private keys MUST be protected according to data sensitivity and certificate assurance level.
- Access to high-value private keys MUST use least privilege, strong authentication, and auditable authorization.
- Exportable keys MUST be encrypted using approved protection and transferred only through authorized channels.
- Key custody responsibilities MUST be assigned and reviewed.

## MUST NOT
- MUST NOT store private keys in source control, tickets, chat, logs, or plaintext configuration.
- MUST NOT share private keys between independent identities merely for deployment convenience.
- MUST NOT disable HSM or key-store protections to bypass operational friction.
- MUST NOT retain private keys after approved destruction requirements apply.

## SHOULD
- Prefer non-exportable hardware-backed keys for high-impact identities.
- Automate detection of exposed key material where practical.

## Exceptions
Require documented necessity, exposure analysis, compensating controls, expiration, and security approval.

## Verification
Inspect key stores, HSM policy, filesystem permissions, secret scanners, access logs, backup handling, and destruction evidence.