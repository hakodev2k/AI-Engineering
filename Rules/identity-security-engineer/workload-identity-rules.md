# Workload Identity Rules

## Purpose
Secure non-human identities used by applications, services, automation, and infrastructure.

## Scope
Applies to service principals, managed identities, workload identities, machine accounts, and automation credentials.

## MUST
- Every workload identity MUST have a named technical owner and defined purpose.
- Permissions MUST be scoped to the minimum resources and actions required.
- Workload identity credentials MUST support rotation or revocation without application redesign.
- Non-human identities MUST be inventoried and periodically reconciled against active workloads.
- Authentication material MUST be protected using platform-native secret or key management controls.

## MUST NOT
- Human user credentials MUST NOT be embedded into workloads.
- Long-lived static credentials MUST NOT be preferred when short-lived or managed identity mechanisms are available.
- One workload identity MUST NOT be reused across unrelated trust boundaries solely for convenience.

## SHOULD
- Prefer federation or managed workload identity over stored secrets.
- Separate identities by environment and privilege boundary.

## Exceptions
Exceptions require owner, risk analysis, expiration, compensating controls, and review evidence.

## Verification
Review identity inventories, permission bindings, credential age, deployment configuration, ownership metadata, and access logs.