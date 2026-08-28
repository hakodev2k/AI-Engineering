# Security and Access Rules

## Purpose
Protect warehouse data through least privilege, controlled access, and auditable authorization.

## Scope
Applies to users, service identities, roles, row/column controls, sharing, and privileged administration.

## MUST
- Access MUST follow least privilege and be granted through managed roles or equivalent policy controls.
- Sensitive datasets MUST have explicit classification and access restrictions appropriate to that classification.
- Privileged changes MUST be attributable to an approved identity and auditable.
- Service identities MUST use scoped credentials and documented ownership.

## MUST NOT
- MUST NOT share personal credentials or embed secrets in SQL, notebooks, repositories, or job definitions.
- MUST NOT weaken access controls merely to unblock analysis or operations.

## SHOULD
- Prefer group- or role-based grants over individual exceptions.
- High-risk access SHOULD be time-bounded and periodically reviewed.

## Exceptions
Exceptions require business justification, risk assessment, expiry, and human approval.

## Verification
Inspect grants, role membership, audit logs, secret scanning, access-review records, and configuration policy.