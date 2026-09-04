# Dataset Access Control Rules
## Purpose
Protect curated data from unauthorized use, modification, and disclosure.
## Scope
Raw sources, intermediate datasets, labels, released datasets, and curation tooling.
## MUST
- Access MUST follow least privilege and be based on role, purpose, and data classification.
- Write access to released or high-value datasets MUST be tightly restricted and auditable.
- Sensitive datasets MUST have explicit access review and revocation processes.
## MUST NOT
- Shared credentials or broadly distributed long-lived access tokens MUST NOT be used.
- Access controls MUST NOT be weakened solely to simplify curation workflows.
## SHOULD
- High-risk datasets SHOULD use time-bounded or just-in-time access where practical.
## Exceptions
Exceptions require documented business need, risk, compensating controls, and approval.
## Verification
Inspect IAM policies, group memberships, audit logs, access reviews, service identities, and revocation tests.