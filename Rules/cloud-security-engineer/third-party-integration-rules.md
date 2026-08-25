# Third-Party Integration Security

## Purpose
Control risk from external SaaS, vendors, federations, and cloud integrations.

## Scope
External identities, APIs, marketplace products, agents, connectors, support access, and cross-tenant integrations.

## MUST
- Integrations MUST document data accessed, permissions granted, trust mechanism, owner, and revocation path.
- Third-party permissions MUST be least-privilege and time-bounded where practical.
- Sensitive integrations MUST assess provider security, data handling, breach implications, and dependency risk before production use.
- High-risk external access MUST receive human approval.

## MUST NOT
- MUST NOT grant tenant-wide or organization-wide privilege when narrower scope satisfies the integration.
- MUST NOT leave unused integrations or vendor identities active.
- MUST NOT send secrets through insecure onboarding channels.

## SHOULD
- Prefer standards-based federation and short-lived tokens over static credentials.
- Periodically recertify external access.

## Exceptions
Require necessity, scope, vendor limitation, compensating controls, owner, expiry where appropriate, and approval.

## Verification
Inspect consent grants, IAM bindings, API scopes, data flows, vendor accounts, authentication method, audit logs, and revocation tests.