# Data Protection

## Purpose
Protect cloud-hosted data according to sensitivity and lifecycle.

## Scope
Databases, object storage, disks, queues, backups, snapshots, analytics stores, and replicas.

## MUST
- Sensitive data MUST be classified before selecting storage, sharing, retention, and protection controls.
- Sensitive data MUST be encrypted in transit and at rest using approved mechanisms.
- Access paths, replication locations, backups, and exports MUST respect data handling requirements.
- Data deletion or destructive retention changes MUST require explicit human approval when irreversible or production-impacting.

## MUST NOT
- MUST NOT make sensitive storage publicly readable.
- MUST NOT copy production-sensitive data into lower-trust environments without approved protection.
- MUST NOT weaken encryption to resolve compatibility issues without risk approval.

## SHOULD
- Minimize stored sensitive data and retention duration.
- Prefer tokenization, masking, or synthetic data where full values are unnecessary.

## Exceptions
Document necessity, affected classifications, legal or contractual constraints, compensating controls, duration, and approval.

## Verification
Inspect storage policies, encryption configuration, TLS enforcement, replication, backup settings, access logs, retention policies, and exposure scans.