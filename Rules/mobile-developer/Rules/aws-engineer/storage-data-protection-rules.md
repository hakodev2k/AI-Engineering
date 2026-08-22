# Storage and Data Protection Rules
## Purpose
Protect durability, confidentiality, integrity, and lifecycle of AWS-hosted data.
## Scope
S3, EBS, EFS, snapshots, object policies, lifecycle, replication, and deletion controls.
## MUST
- Classify stored data and configure encryption, access, retention, and deletion controls accordingly.
- Block unintended public access to private data stores.
- Enable versioning, retention, replication, or deletion protection when recovery requirements demand them.
- Review lifecycle rules for irreversible deletion impact before deployment.
## MUST NOT
- Make a bucket public as a shortcut around application or distribution design.
- Delete protected production data without explicit authorization and verified recovery implications.
## SHOULD
- Use lifecycle tiers based on measured access and retention requirements.
## Exceptions
Exceptions require data owner, scope, risk, compensating controls, duration, and approval.
## Verification
Inspect bucket policies, public-access settings, encryption, lifecycle, versioning, snapshots, access logs, and restore evidence.