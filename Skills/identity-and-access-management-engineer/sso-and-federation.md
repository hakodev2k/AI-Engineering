# SSO and Federation

## Purpose
Design secure single sign-on and federation relationships using standards such as OIDC, OAuth 2.0, and SAML without creating excessive trust.

## When to use
Use when onboarding SaaS, integrating applications, consolidating identity providers, or reviewing federation risk.

## Inputs
IdP and relying-party capabilities, claims, redirect URIs, metadata, certificates, logout requirements, tenancy model.

## Context to inspect
Existing trust configurations, signing/encryption settings, claim mappings, token lifetimes, ACS/redirect endpoints, issuer/audience validation, logout behavior.

## Core knowledge
Federation security depends on strict issuer, audience, signature, redirect, nonce/state, and key validation. Claims are authorization inputs and must not be trusted beyond their issuer semantics.

## Procedure
1. Choose the protocol suited to the application and client type.
2. Define trust direction and metadata ownership.
3. Minimize claims and map immutable identifiers.
4. Configure strict redirect/ACS allowlists.
5. Validate issuer, audience, signatures, nonce/state, and token time bounds.
6. Define key rotation and metadata refresh.
7. Set session and logout behavior.
8. Test account linking and tenant isolation.
9. Test invalid, expired, replayed, and wrongly issued assertions/tokens.
10. Document rollback and certificate/key expiry handling.

## Decision points
Prefer OIDC for modern applications; use SAML where ecosystem constraints require it. Avoid custom federation protocols.

## Common failure patterns
Email-based account linking, wildcard redirects, unsigned assertions, stale certificates, over-broad claims, and relying parties that skip audience validation.

## Verification
Capture successful and deliberately invalid flows and confirm rejection, logging, and session behavior.

## Expected output
Federation configuration, claim contract, rotation plan, validation checklist, and test evidence.

## Stop conditions
Escalate if the relying party cannot validate critical protocol properties or requires insecure wildcard trust.