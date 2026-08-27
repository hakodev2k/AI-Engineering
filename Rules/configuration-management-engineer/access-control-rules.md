# Configuration Access Control

## Purpose
Restrict who and what can read, modify, approve, and activate configuration.

## Scope
Repositories, configuration services, administrative interfaces, APIs, automation identities, and runtime stores.

## MUST
- Write and activation privileges MUST follow least privilege and separation of duties appropriate to risk.
- Human and workload identities MUST be individually attributable; shared privileged credentials require exceptional justification.
- Sensitive configuration read access MUST be restricted independently from ordinary configuration where feasible.
- Privileged access changes MUST be auditable and periodically reviewed.
- Automation identities MUST receive only the scopes required for their managed domains.

## MUST NOT
- Broad administrative access MUST NOT be granted merely to simplify automation.
- Approval controls MUST NOT be bypassable by the same identity whose change requires independent approval.
- Access MUST NOT persist indefinitely when it was granted for a temporary operational need.

## SHOULD
- Prefer role-based or attribute-based policy with short-lived elevation.
- Alert on unusual privileged configuration activity.

## Exceptions
Break-glass access requires controlled credentials, strong authentication, logging, explicit incident justification, and prompt review or revocation.

## Verification
Inspect IAM policies, repository protections, service roles, elevation records, audit logs, and periodic access reviews. Test that unauthorized identities cannot read or mutate protected configuration.