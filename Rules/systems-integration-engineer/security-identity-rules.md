# Security and Identity Rules

## Purpose
Protect integration identities, trust boundaries, and authorization decisions.

## Scope
Applies to service accounts, workload identities, certificates, tokens, API keys, delegated access, and cross-system authorization.

## MUST
- Every integration identity MUST have an accountable owner, explicit purpose, and least-privilege permissions.
- Authentication and authorization MUST be enforced at appropriate trust boundaries.
- Long-lived credentials MUST be avoided when short-lived workload identity is available.
- Credential rotation and revocation behavior MUST be operationally understood.
- High-risk permission changes MUST require human approval and evidence of necessity.

## MUST NOT
- MUST NOT share personal user credentials for machine-to-machine integrations.
- MUST NOT disable authentication or authorization controls to unblock delivery.
- MUST NOT grant broad administrative privileges when narrower permissions satisfy the integration.

## SHOULD
- Separate identities SHOULD be used across environments and materially different workloads.
- Authorization failures SHOULD be observable without leaking sensitive details.

## Exceptions
Document the constraint, permissions granted, duration, risk, compensating controls, and approver.

## Verification
Inspect IAM configuration, access policies, token scopes, identity ownership, rotation configuration, audit logs, and negative authorization tests.