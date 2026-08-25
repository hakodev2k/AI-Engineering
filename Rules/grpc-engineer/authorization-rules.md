# Authorization Rules

## Purpose
Ensure authenticated callers can perform only explicitly permitted RPC actions.

## Scope
Method authorization, resource authorization, tenant isolation, delegated identity, and policy enforcement.

## MUST
- Every protected RPC MUST enforce authorization at a trusted server-side boundary.
- Resource-level access MUST be checked against authenticated identity and authoritative resource context.
- Multi-tenant services MUST enforce tenant isolation independently of client-provided identifiers.
- Authorization denials MUST be auditable without exposing sensitive policy internals.

## MUST NOT
- MUST NOT equate authentication with authorization.
- MUST NOT rely solely on UI, gateway, or client checks for server-side protection.
- MUST NOT accept privilege claims from untrusted metadata.
- MUST NOT broaden access merely to resolve integration failures.

## SHOULD
- Prefer deny-by-default policies and explicit grants.
- Shared authorization logic SHOULD be consistently tested across RPC methods.

## Exceptions
Emergency privilege elevation requires human approval, time bounds, auditability, and post-use revocation.

## Verification
Run negative authorization and tenant-isolation tests; inspect policy mappings, identity propagation, audit events, and least-privilege configuration.