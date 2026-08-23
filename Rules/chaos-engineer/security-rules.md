# Chaos Security Rules
## Purpose
Prevent powerful fault tooling from becoming an attack path.
## Scope
IAM, secrets, tooling, agents, network access, and audit.
## MUST
- Apply least privilege and environment separation to fault-injection identities.
- Protect credentials using approved secret systems.
- Audit privileged experiment execution.
- Review high-risk tooling dependencies and access paths.
## MUST NOT
- Disable security controls merely to make fault injection easier.
- Expose fault-control endpoints publicly without appropriate protection.
## SHOULD
- Use short-lived credentials and just-in-time privilege.
## Exceptions
Break-glass access requires explicit authority, time bounds, logging, and review.
## Verification
Inspect IAM, secret scans, network policy, dependency scans, and audit records.