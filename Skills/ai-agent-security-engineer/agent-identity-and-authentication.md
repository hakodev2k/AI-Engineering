# Agent Identity and Authentication

## Purpose
Establish trustworthy identities for agents, users, services, and delegated actions so every security-sensitive operation can be attributed and authenticated correctly.

## When to use
Use when agents call external systems, act on behalf of users, cross tenant boundaries, or run as shared services.

## Inputs
Identity architecture, user authentication flows, service accounts, OAuth/OIDC configuration, tool APIs, tenant model, and audit requirements.

## Preconditions
Separate who requested an action from which service executes it. Define whether the agent acts as itself, as the user, or through delegated authority.

## Context to inspect
Token issuance, claims, audience, scopes, session binding, service identities, credential storage, rotation, and impersonation paths.

## Core knowledge
Authentication proves identity; authorization determines allowed actions. Delegation must preserve user and agent provenance. Shared credentials erase accountability and expand blast radius.

## Procedure
1. Identify every principal in the workflow.
2. Define trust relationships and token issuers.
3. Choose service identity versus user-delegated identity per action.
4. Validate issuer, audience, expiry, signature, and required claims.
5. Bind tenant and user context where applicable.
6. Use short-lived credentials and secure refresh flows.
7. Prevent credential forwarding to unintended tools.
8. Record initiating user, agent identity, delegated principal, and target resource in audit logs.
9. Design revocation and key rotation.
10. Test expired, replayed, wrong-audience, cross-tenant, and privilege-escalation cases.

## Decision points
Prefer user delegation when downstream authorization must reflect user rights; prefer service identity for bounded autonomous operations with explicit service policy.

## Common failure patterns
Long-lived API keys, shared identities across tenants, trusting user IDs supplied by the model, missing audience validation, and silent impersonation.

## Verification
Verify invalid and cross-tenant credentials are rejected and that audit records reconstruct who caused each action.

## Expected output
An identity and delegation design with token requirements, trust boundaries, audit fields, and negative authentication tests.

## Stop conditions
Escalate when downstream systems lack identity separation needed for the required security boundary.