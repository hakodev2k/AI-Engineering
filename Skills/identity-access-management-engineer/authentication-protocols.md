# Authentication Protocols

## Purpose
Select, configure, and review modern authentication protocols without introducing avoidable credential, token, or trust weaknesses.

## When to use
Use for SSO, federation, API authentication, native/web applications, enterprise integrations, and protocol migrations.

## Inputs
Client type, identity provider, relying party, protocol support, assurance requirements, token consumers, network boundaries, and compatibility constraints.

## Context to inspect
Inspect OIDC/OAuth 2.x/SAML flows, redirect URIs, client authentication, scopes, claims, signing/encryption, token lifetimes, session behavior, and logout requirements.

## Core knowledge
OIDC provides authentication over OAuth authorization primitives; OAuth delegates authorization and is not itself a login protocol. SAML remains common for enterprise federation. Protocol security depends heavily on flow selection, redirect validation, key handling, audience/issuer validation, and replay defenses.

## Procedure
1. Identify the actual security goal: authentication, delegated authorization, or federation.
2. Classify the client and its ability to protect secrets.
3. Select a standards-based flow appropriate to that client.
4. Define issuer, audience, scopes, claims, redirect URIs, and token lifetimes.
5. Require PKCE where appropriate and strong client authentication for confidential clients.
6. Validate state, nonce, signatures, issuer, audience, and timestamps.
7. Define key rotation and metadata refresh behavior.
8. Test logout, expiration, revocation, replay, and error paths.
9. Remove legacy flows when migration is complete.

## Decision points
Choose OIDC for modern interactive authentication, OAuth for delegated API authorization, and SAML when ecosystem constraints require it. Do not introduce multiple protocols without a justified interoperability need.

## Common failure patterns
Using OAuth access tokens as identity proof without validation, wildcard redirects, long-lived bearer tokens, static client secrets, missing audience checks, insecure implicit flows, and trusting unvalidated claims.

## Verification
Capture protocol traces in a safe environment and verify every security-relevant field, failure path, expiry behavior, key rotation, and negative test.

## Expected output
A protocol design/configuration with validated flows, controls, compatibility assumptions, and tests.

## Stop conditions
Stop when the provider cannot meet required assurance, legacy compatibility requires weakening controls without approval, or protocol ownership is unclear.