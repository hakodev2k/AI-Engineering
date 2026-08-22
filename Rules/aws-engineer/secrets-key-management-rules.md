# Secrets and Key Management Rules
## Purpose
Protect credentials, cryptographic keys, and sensitive configuration.
## Scope
KMS, Secrets Manager, Parameter Store, certificates, rotation, and encryption keys.
## MUST
- Store secrets only in approved secret-management systems with access logging and least privilege.
- Define key ownership, purpose, deletion protection, and recovery implications for critical KMS keys.
- Encrypt sensitive data in transit and at rest using controls appropriate to its classification.
- Treat key deletion, rotation, and policy changes as high-risk operations requiring impact review.
## MUST NOT
- Place plaintext secrets in repositories, AMIs, container images, user data, logs, or tickets.
- Schedule destructive key deletion without explicit human approval and dependency verification.
## SHOULD
- Automate rotation where consumers support it safely.
## Exceptions
Exceptions require documented risk, compensating controls, owner, duration, and approval.
## Verification
Inspect secret stores, KMS policies, rotation settings, CloudTrail, repository scans, encryption configuration, and dependency evidence.