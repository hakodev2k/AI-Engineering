# Security and Access Rules

## Purpose
Prevent unauthorized flag changes from becoming an application-control bypass.

## Scope
Human, service, and automation access to flag systems.

## MUST
- Production mutation access MUST use least privilege and strong authentication.
- High-risk flag classes MUST use role separation or approval controls appropriate to impact.
- Service credentials MUST be scoped to required read or write capabilities.
- Access changes and privileged mutations MUST be auditable.

## MUST NOT
- Shared personal credentials MUST NOT be used for production flag administration.
- Client-exposed credentials MUST NOT have server-side mutation authority.
- Security controls MUST NOT be weakened merely to accelerate rollout.

## SHOULD
- Privileged access SHOULD be time-bounded where supported.
- Dormant access SHOULD be periodically removed.

## Exceptions
Emergency elevation requires authorized approval, bounded duration, audit evidence, and subsequent review.

## Verification
Inspect IAM policies, credential scopes, authentication settings, audit logs, and access reviews.