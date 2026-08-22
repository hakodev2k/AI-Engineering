# Data Protection Rules
## Purpose
Protect cloud-hosted data throughout its lifecycle.
## Scope
Storage, databases, backups, replicas, transfers, snapshots, and logs containing sensitive data.
## MUST
- Data MUST be classified before selecting storage, retention, replication, and access controls.
- Sensitive data MUST be encrypted in transit and at rest using approved mechanisms.
- Retention and deletion behavior MUST satisfy explicit business and regulatory requirements.
## MUST NOT
- MUST NOT copy production-sensitive data into lower environments without approved protection or anonymization.
- MUST NOT create unmanaged snapshots or exports containing sensitive data.
## SHOULD
- Minimize collected, replicated, and retained sensitive data.
## Exceptions
Exceptions require data owner, risk assessment, compensating controls, duration, and approval.
## Verification
Inspect encryption settings, access policies, retention configuration, inventories, data-flow documentation, and audit logs.