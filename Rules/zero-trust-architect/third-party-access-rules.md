# Third-Party Access Rules

## Purpose
Control supplier, partner, contractor, and SaaS integration access without creating persistent external trust relationships.

## Scope
Applies to external human users, federated partners, vendors, support providers, B2B applications, SaaS integrations, and third-party APIs.

## MUST
- Every third-party access relationship MUST have a business sponsor, accountable resource owner, defined purpose, scope, and lifecycle.
- External identities MUST use federation or another managed identity mechanism where feasible and MUST meet authentication assurance appropriate to the accessed resource.
- Third-party privileges MUST be least-privilege, time-bounded where practical, and reviewed at a frequency proportional to risk.
- API and application integrations MUST use unique machine identities with explicit permissions rather than shared human credentials.
- Third-party offboarding MUST revoke identities, tokens, certificates, network paths, and delegated permissions that are no longer required.
- Sensitive third-party activity MUST be auditable and distinguishable from internal activity.
- High-risk external access MUST evaluate device, network, session, or other contextual controls appropriate to the threat model.

## MUST NOT
- Permanent broad vendor accounts MUST NOT be created solely for convenience.
- Third-party users MUST NOT inherit internal trust merely because they authenticate through an approved identity provider or connect through a private network.
- Shared support accounts MUST NOT be used when individual attribution is technically feasible.
- Expired contracts, support periods, or sponsorship MUST NOT leave access active by default.

## SHOULD
- Vendor support access SHOULD be just-in-time and enabled only for active support work.
- External access SHOULD be isolated from unrelated resources and administrative planes.
- Third-party security requirements SHOULD be traceable to the access risk and contractual obligations.

## Exceptions
Exceptions require documented business need, exact access scope, duration, risk, compensating controls, sponsor, resource-owner approval, and security approval for high-risk access.

## Verification
Inspect external identity inventories, federation policies, sponsorship records, integration credentials, entitlement reviews, access logs, contract/offboarding evidence, and negative tests. Verify expired or terminated external identities cannot reach protected resources.