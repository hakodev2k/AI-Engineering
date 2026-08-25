# Identity and Access

## Purpose
Enforce identity-first, least-privilege access to cloud resources.

## Scope
Human, workload, service, federated, and emergency identities.

## MUST
- Access MUST be granted to named roles or workload identities with the minimum required actions and scope.
- Privileged access MUST use strong authentication and auditable elevation where supported.
- Machine identities MUST have explicit owners, purpose, scope, and lifecycle.
- High-risk access changes MUST receive human approval before execution.

## MUST NOT
- MUST NOT use shared human administrator accounts.
- MUST NOT grant wildcard administrative permissions when narrower permissions satisfy the requirement.
- MUST NOT retain access after its business or operational need ends.

## SHOULD
- Prefer short-lived credentials and just-in-time privilege.
- Periodically recertify privileged and externally federated access.

## Exceptions
Exceptions require a documented necessity, bounded duration, compensating controls, monitoring, and accountable approval.

## Verification
Inspect IAM policies, group and role membership, authentication settings, access-analysis findings, privilege-elevation logs, and recertification records.