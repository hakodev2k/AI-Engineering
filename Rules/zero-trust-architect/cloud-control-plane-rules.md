# Cloud Control Plane Rules

## Purpose
Protect cloud management planes as high-value Zero Trust resources requiring strong identity, least privilege, isolation, and verifiable change control.

## Scope
Applies to cloud consoles, management APIs, organization and account controls, subscriptions, projects, resource managers, Kubernetes control planes, and infrastructure administration.

## MUST
- Cloud administrative access MUST use centrally managed identities with strong authentication and explicit least-privilege authorization.
- Organization, account, subscription, project, and environment boundaries MUST reflect ownership, blast-radius, data-sensitivity, and separation-of-duties requirements.
- Privileged cloud roles MUST be time-bounded or just-in-time where supported and MUST be auditable.
- Production and security-control changes MUST be attributable and MUST pass the required approval and deployment controls.
- Machine access to management APIs MUST use unique workload identities with narrowly scoped permissions.
- Control-plane logs MUST be enabled for security-relevant operations and protected against unauthorized alteration.
- High-risk administrative paths MUST have tested emergency-access and recovery procedures.

## MUST NOT
- Root, owner, global administrator, or equivalent maximum privilege MUST NOT be used for routine operations.
- Static user access keys MUST NOT be preferred over managed identity or short-lived federation mechanisms.
- Private connectivity MUST NOT be treated as sufficient authorization for management APIs.
- Production cloud permissions MUST NOT be copied wholesale from development environments.
- Public management endpoints MUST NOT be exposed without documented authentication, authorization, network, and monitoring controls appropriate to the risk.

## SHOULD
- Management-plane access SHOULD use dedicated administrative devices or isolated access paths for critical environments.
- Infrastructure policy SHOULD be represented as code and continuously checked for drift.
- Organization-level preventive controls SHOULD enforce non-negotiable security boundaries where practical.

## Exceptions
Exceptions require exact privilege and resource scope, business need, risk, compensating controls, owner, expiry, rollback plan, and approval by the accountable cloud and security owners.

## Verification
Inspect cloud IAM, organization policies, account boundaries, management endpoint exposure, audit logging, access-key inventories, infrastructure code, drift reports, privilege-elevation records, and recovery tests.