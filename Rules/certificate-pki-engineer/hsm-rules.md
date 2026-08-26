# HSM Rules

## Purpose
Protect high-value keys with hardened cryptographic boundaries.

## Scope
HSM selection, configuration, administration, clustering, backup, and lifecycle.

## MUST
- HSM security mode, firmware, partitions, roles, and authentication policy MUST be approved and documented.
- Administrative duties for critical CA keys MUST be separated from routine issuance operations.
- HSM backup and restore procedures MUST be tested without exposing private key material.
- Firmware or security-mode changes affecting production keys MUST require human approval and rollback analysis.

## MUST NOT
- MUST NOT disable tamper, audit, quorum, or authentication controls merely to restore convenience.
- MUST NOT perform destructive HSM initialization against production partitions without verified backups and approval.
- MUST NOT expose key material during troubleshooting.

## SHOULD
- Critical HSM services SHOULD have tested redundancy appropriate to recovery objectives.

## Exceptions
Require documented risk, compensating controls, duration, and security approval.

## Verification
Inspect HSM policy, audit logs, role assignments, backup evidence, firmware state, and recovery tests.