# Encryption and Key Management Compliance Rules

## Purpose
Ensure cryptographic protections and key lifecycle controls satisfy defined security obligations.

## Scope
Applies to encryption at rest and in transit, key generation, storage, distribution, rotation, revocation, backup, and destruction.

## MUST
- Required encryption states MUST be defined for each protected data class and system boundary.
- Cryptographic keys MUST have identified owners, approved storage, access controls, rotation expectations, and recovery procedures.
- Key access MUST be limited, logged, and periodically reviewed.
- Deprecated or prohibited algorithms and protocols MUST be identified and remediated according to risk.

## MUST NOT
- Keys or private material MUST NOT be stored in source code, plaintext configuration, tickets, or general documentation.
- Encryption compliance MUST NOT be inferred solely from product defaults without configuration inspection.
- Key rotation MUST NOT be performed destructively without recovery and compatibility planning.

## SHOULD
- Use managed key services or hardware-backed protection where risk warrants it.
- Track cryptographic inventory and algorithm lifecycle proactively.

## Exceptions
Legacy cryptography exceptions require documented exposure, compensating controls, migration plan, deadline, and security approval.

## Verification
Inspect configuration, key-management policies, access logs, rotation records, protocol scans, and cryptographic inventory.