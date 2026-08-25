# Access Control Rules

## Purpose
Limit secret access to explicitly authorized identities and necessary operations.

## Scope
Human, workload, automation, break-glass, and administrative access to secret-management systems.

## MUST
- Access MUST be granted to named identities or controlled workload identities using least privilege and explicit scope.
- Human privileged access MUST require strong authentication and be reviewable.
- Authorization MUST distinguish read, issue, rotate, revoke, administer, and audit capabilities where supported.
- Access changes affecting production or high-impact credentials MUST be independently reviewed.

## MUST NOT
- Shared human accounts MUST NOT be used for routine secret administration.
- Wildcard access across unrelated applications or environments MUST NOT be granted without documented necessity.
- Application operators MUST NOT automatically receive access to underlying secret values.

## SHOULD
- Prefer just-in-time privileged access and group/role assignment over direct grants.
- Separate secret administrators from audit reviewers for high-risk environments.

## Exceptions
Broader access requires scope, justification, expiry, compensating monitoring, and accountable approval.

## Verification
Inspect IAM policies, group membership, access reviews, authentication requirements, audit logs, denied-access tests, and stale grants. Confirm actual provider permissions match approved intent.