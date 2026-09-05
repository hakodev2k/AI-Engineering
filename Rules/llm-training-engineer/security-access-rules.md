# Training Security and Access Rules

## Purpose
Protect high-value model artifacts, datasets, credentials, and training infrastructure from unauthorized access or modification.

## Scope
Training clusters, artifact stores, dataset stores, experiment systems, service identities, secrets, checkpoints, and administrative actions.

## MUST
- Training identities MUST use least privilege and separate permissions for reading data, launching jobs, writing checkpoints, and promoting releases where practical.
- Secrets MUST come from approved secret-management mechanisms and MUST be excluded from source, configs, logs, and datasets.
- Access to restricted datasets and model artifacts MUST be authenticated, authorized, and auditable.
- High-risk access changes, secret rotation, security-control weakening, and production configuration changes MUST require authorized human approval.
- Training environments MUST use supported security patches or documented compensating controls for material vulnerabilities.

## MUST NOT
- MUST NOT share long-lived credentials through scripts, notebooks, chat, or checkpoint metadata.
- MUST NOT grant broad administrative privileges merely to unblock a training job.
- MUST NOT disable audit, network, or identity controls without explicit risk acceptance.

## SHOULD
- Workloads SHOULD use short-lived workload identities instead of static keys.
- Artifact integrity SHOULD be protected with immutable versions and checksums/signatures where appropriate.

## Exceptions
Emergency access requires bounded duration, named approval, audit trail, and prompt revocation/review.

## Verification
Inspect IAM policies, secret scans, access logs, workload identities, vulnerability status, artifact permissions, and approval records.