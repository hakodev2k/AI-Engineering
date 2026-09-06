# Access Control Rules

## Purpose
Protect schema registration, modification, discovery, and administrative operations through least privilege.

## Scope
Users, service identities, subjects, compatibility settings, administrative APIs, and registry environments.

## MUST
- All registry access MUST require authenticated identity.
- Write and administrative permissions MUST be scoped to the minimum subjects and actions required.
- High-risk operations such as compatibility-policy weakening, subject deletion, or global configuration changes MUST require elevated authorization and auditability.
- Production and non-production access boundaries MUST be explicit.
- Authorization failures MUST be logged without exposing credentials or sensitive schema content unnecessarily.

## MUST NOT
- MUST NOT use anonymous production write access.
- MUST NOT share privileged credentials across unrelated services.
- MUST NOT grant global administrative rights solely for convenience.

## SHOULD
- Prefer workload identity and short-lived credentials.
- Review privileged registry access periodically.

## Exceptions
Break-glass access requires incident justification, time bounds, logging, and post-event review.

## Verification
Inspect IAM policy, ACLs, service identities, audit logs, and unauthorized-operation tests.