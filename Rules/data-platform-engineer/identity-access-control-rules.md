# Identity and Access Control Rules

## Purpose
Ensure data platform access follows least privilege, strong identity boundaries, and auditable authorization.

## Scope
Applies to human users, service identities, workloads, administrators, datasets, compute, storage, metadata, and platform APIs.

## MUST
- Access MUST be granted to authenticated identities through explicit roles or policies with a defined owner and purpose.
- Privileged access MUST be minimized, auditable, time-bounded where practical, and separated from routine workload credentials.
- Authorization MUST be enforced at every trust boundary where an identity can read, write, administer, or delegate access.
- High-risk access changes affecting production-sensitive data or platform administration MUST require explicit human approval.
- Orphaned, inactive, or obsolete identities and grants MUST be removed through a defined lifecycle process.

## MUST NOT
- MUST NOT share personal administrator credentials across users or automation.
- MUST NOT grant broad wildcard access solely to avoid maintaining permissions.
- MUST NOT weaken authentication or authorization controls to unblock a pipeline without approved risk acceptance.

## SHOULD
- Prefer workload identity and short-lived credentials over long-lived static credentials.
- SHOULD automate periodic access reviews for privileged and sensitive resources.

## Exceptions
Exceptions require business need, scope, duration, risk, compensating controls, owner, and security approval.

## Verification
Inspect IAM policy, role bindings, audit logs, negative authorization tests, access-review evidence, credential age, and privileged access paths.