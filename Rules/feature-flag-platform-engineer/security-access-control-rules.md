# Security and Access Control Rules

## Purpose
Protect flag configuration from unauthorized reads, writes, and privilege escalation.

## Scope
Applies to users, service accounts, API tokens, environments, projects, segments, and administrative operations.

## MUST
- Production flag mutation MUST require authenticated identities and least-privilege authorization.
- Privileged operations MUST be separated from read-only evaluation access.
- Service credentials MUST be scoped to the minimum required environments and capabilities.
- Sensitive configuration changes MUST produce immutable audit evidence.
- Access reviews MUST cover dormant accounts, excessive privileges, and machine credentials.

## MUST NOT
- MUST NOT share administrator credentials across people or services.
- MUST NOT expose production write credentials to client applications or untrusted build artifacts.
- MUST NOT disable approval or access controls merely to accelerate routine rollout.

## SHOULD
- High-risk environments SHOULD use stronger authentication and change-approval controls than development environments.

## Exceptions
Emergency access requires time-bounded elevation, explicit incident context, and post-event review.

## Verification
Inspect IAM policy, token scopes, audit logs, access-review records, secret scans, and environment permission tests.