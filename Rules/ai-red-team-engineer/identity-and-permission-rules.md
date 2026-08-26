# Identity and Permission Attacks

## Purpose
Verify that AI behavior cannot bypass application identity and authorization boundaries.

## Scope
Users, service identities, agents, delegated credentials, tenants, roles, scopes, and tool permissions.

## MUST
- Test horizontal and vertical authorization boundaries independently of model responses.
- Verify delegated actions preserve caller identity, scope, tenant, and approval constraints.
- Test stale, revoked, downgraded, and conflicting permissions where supported.

## MUST NOT
- Rely on natural-language claims of identity as authorization evidence.
- Allow model-generated identifiers to select privileged resources without server-side checks.

## SHOULD
Include confused-deputy and cross-context identity propagation scenarios.

## Exceptions
Untestable identity paths require documented architecture evidence and compensating verification.

## Verification
Inspect authorization logs, token scopes, identity propagation, resource ownership, tool calls, and denied-action tests.