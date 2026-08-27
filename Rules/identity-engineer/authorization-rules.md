# Authorization
## Purpose
Keep access decisions explicit, least-privileged, and reviewable.
## Scope
Roles, permissions, policies, claims, entitlements, and resource access.
## MUST
- Authorization MUST be enforced at the trusted resource boundary, not only in clients.
- Privileges MUST be scoped to required actions and resources.
- Sensitive privilege changes MUST produce attributable audit evidence.
## MUST NOT
- Authentication success MUST NOT be treated as authorization.
- Default or wildcard grants MUST NOT be introduced without documented necessity and review.
## SHOULD
- Prefer policy models that can be tested deterministically.
## Exceptions
Record business need, scope, expiry, risk, compensating controls, and approver.
## Verification
Use policy tests, access reviews, configuration inspection, and denied-path integration tests.