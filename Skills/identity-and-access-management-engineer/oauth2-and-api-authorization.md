# OAuth 2.0 and API Authorization

## Purpose
Design OAuth-based delegated and service authorization with correct grant selection, scopes, token boundaries, and resource-server validation.

## When to use
Use for APIs, mobile/web clients, service-to-service access, delegated consent, or authorization reviews.

## Inputs
Client types, resource servers, actors, scopes, token formats, trust domains, consent model, threat model.

## Context to inspect
Authorization server, client registrations, redirect URIs, grant types, scopes, audiences, token lifetimes, refresh-token policy, API validation logic.

## Core knowledge
OAuth is an authorization framework, not identity proof by itself. Public clients need PKCE; resource servers must validate issuer, audience, signature, expiry, and intended authorization context.

## Procedure
1. Classify clients as public or confidential.
2. Select grants appropriate to each actor and client.
3. Define resource-oriented scopes and audiences.
4. Require PKCE for authorization-code flows where applicable.
5. Restrict redirect URIs exactly.
6. Protect client credentials and refresh tokens.
7. Define token lifetime and rotation/revocation behavior.
8. Validate tokens at every resource server.
9. Separate user delegation from workload authorization.
10. Test scope escalation, token replay, audience confusion, and revoked sessions.

## Decision points
Use opaque tokens when centralized introspection/control is valuable; JWTs when decentralized validation and latency matter. Keep lifetimes short when revocation is weak.

## Common failure patterns
Using ID tokens as API tokens, broad catch-all scopes, shared client secrets, missing audience checks, implicit trust in token claims, and unbounded refresh tokens.

## Verification
Exercise allowed and denied API calls across scope, audience, expiry, revocation, and client boundaries.

## Expected output
Grant model, scope/audience design, client requirements, validation rules, and test evidence.

## Stop conditions
Escalate when a client cannot safely hold required credentials or an API cannot enforce token boundaries.