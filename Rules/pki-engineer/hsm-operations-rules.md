# HSM Operations

## Purpose
Control high-assurance cryptographic operations performed in hardware security modules.

## Scope
Applies to HSM provisioning, initialization, partitioning, key custody, backup, firmware, access, and decommissioning.

## MUST
- HSM initialization and security-domain changes MUST follow documented dual-control procedures.
- Administrative and cryptographic roles MUST be separated where the platform supports separation of duties.
- Firmware and configuration changes MUST be risk-assessed, tested, and approved before production use.
- HSM backups MUST be protected, inventoried, periodically tested, and recoverable by authorized custodians.

## MUST NOT
- MUST NOT bypass quorum controls or share administrator credentials.
- MUST NOT upgrade production HSM firmware without rollback and compatibility evidence.
- MUST NOT leave default credentials, default partitions, or undocumented operator access enabled.

## SHOULD
- Use independent custody for quorum components.
- Regularly validate capacity, audit logging, and failover behavior.

## Exceptions
Require documented emergency justification, compensating controls, security approval, and retrospective review.

## Verification
Inspect HSM audit logs, role assignments, quorum policy, firmware inventory, backup tests, change records, and recovery evidence.