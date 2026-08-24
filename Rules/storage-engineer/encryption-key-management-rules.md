# Encryption and Key Management Rules

## Purpose
Protect stored and transmitted data without creating unrecoverable key dependencies.

## Scope
Encryption at rest, in transit, key ownership, rotation, escrow, and certificate handling.

## MUST
- Sensitive data MUST use encryption appropriate to its classification and threat model.
- Key material MUST be stored outside source code and ordinary configuration repositories.
- Key access MUST be least-privileged and auditable.
- Rotation and recovery procedures MUST be tested before relying on customer-managed keys for critical data.
- Encryption changes with data-loss or outage potential MUST require human approval.

## MUST NOT
- MUST NOT log keys, secrets, tokens, or plaintext sensitive data for troubleshooting.
- MUST NOT destroy or revoke a key needed to decrypt retained data without verified disposition or recovery approval.

## SHOULD
- Separate key-administration authority from storage-administration authority for high-impact systems.

## Exceptions
Legacy limitations require documented risk, compensating controls, and remediation ownership.

## Verification
Inspect encryption settings, key policies, secret scanning, audit records, rotation tests, and recovery evidence.