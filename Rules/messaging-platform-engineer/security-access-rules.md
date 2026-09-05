# Security and Access Rules

## Purpose
Protect messaging infrastructure, topics, queues, and message data from unauthorized access.

## Scope
Authentication, authorization, service identities, ACLs, tenancy, administrative access, and broker endpoints.

## MUST
- Producers, consumers, and administrators MUST authenticate with distinct least-privilege identities appropriate to their duties.
- Authorization MUST restrict publish, consume, manage, and inspect operations independently where supported.
- Cross-tenant access boundaries MUST be explicit and tested.
- Administrative access MUST be auditable.

## MUST NOT
- MUST NOT use shared broad credentials across unrelated applications.
- MUST NOT grant administrative permissions merely to unblock application connectivity.
- MUST NOT expose broker management interfaces publicly without explicit requirement and strong controls.

## SHOULD
- Prefer short-lived workload identities over static credentials.

## Exceptions
Privilege expansion requires documented need, risk, bounded duration when temporary, and approval.

## Verification
Inspect IAM/ACL configuration, identity mappings, access tests, network exposure, and audit logs.