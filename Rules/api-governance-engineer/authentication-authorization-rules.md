# Authentication and Authorization Rules

## Purpose
Ensure API identity and access-control expectations are explicit, enforceable, and consistent.

## Scope
Applies to machine, user, service, partner, and delegated API access.

## MUST
- Every protected operation MUST define the required identity context and authorization decision.
- Authorization MUST be evaluated server-side against current policy and resource context.
- Least-privilege scopes or permissions MUST be used for external and internal clients.
- Tenant, account, and resource ownership boundaries MUST be enforced independently of client-supplied identifiers.
- Security-sensitive authorization changes MUST receive explicit review and production approval.

## MUST NOT
- Possession of a resource identifier MUST NOT be treated as authorization.
- Clients MUST NOT be trusted to enforce access controls that protect server-side data or actions.
- Credentials, tokens, or session secrets MUST NOT be returned in logs or error payloads.
- Security controls MUST NOT be disabled merely to unblock integration.

## SHOULD
- Authorization semantics SHOULD be consistent across related APIs.
- Policy decisions SHOULD be auditable without exposing sensitive credentials.

## Exceptions
Exceptions require a threat assessment, compensating controls, time bounds where possible, security approval, and verification evidence.

## Verification
Use authorization matrices, negative-path integration tests, tenant-isolation tests, configuration inspection, access logs, and security review. Verify denied operations cannot be reached through alternate endpoints.