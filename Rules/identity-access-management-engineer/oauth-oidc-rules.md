# OAuth and OpenID Connect Rules

## Purpose
Use OAuth 2.x and OpenID Connect with explicit token, client, and trust semantics.

## Scope
Authorization servers, clients, resource servers, scopes, consent, tokens, redirect flows, and token validation.

## MUST
- Clients MUST use an approved flow appropriate to client confidentiality and execution environment.
- Resource servers MUST validate token signature, issuer, audience, expiry, and authorization claims.
- Scopes and claims MUST represent bounded capabilities rather than vague global privilege.
- Public clients MUST use current protocol protections such as PKCE where applicable.

## MUST NOT
- MUST NOT treat ID tokens as generic API authorization tokens.
- MUST NOT place secrets in browser-delivered public clients.
- MUST NOT log bearer tokens or authorization codes.
- MUST NOT use redirect URI patterns broader than required.

## SHOULD
- Prefer short token lifetimes, sender-constrained mechanisms where justified, and explicit audience separation.

## Exceptions
Protocol deviations require interoperability evidence, threat analysis, compensating controls, expiry, and approval.

## Verification
Inspect client registrations, token-validation code/configuration, negative protocol tests, scope matrices, and security test results.