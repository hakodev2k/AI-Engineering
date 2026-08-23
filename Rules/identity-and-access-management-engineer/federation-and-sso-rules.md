# Federation and SSO Rules

## Purpose
Ensure federated trust and single sign-on relationships are explicit, bounded, and verifiable.

## Scope
SAML, OIDC, OAuth-based sign-in, enterprise federation, trust metadata, claims, and relying-party configuration.

## MUST
- Every federation trust MUST identify the authoritative issuer, intended audience, accepted algorithms, and lifecycle owner.
- Token and assertion validation MUST verify issuer, audience, signature, validity window, and required claims.
- Claim mappings MUST use authoritative attributes and documented transformations.
- Trust certificates, signing keys, and metadata MUST have rotation and expiry procedures.
- New federation relationships MUST be tested for unauthorized audience, replay, and privilege-mapping failures before production use.

## MUST NOT
- MUST NOT accept unsigned or weakly validated assertions for protected access.
- MUST NOT trust broad wildcard redirect URIs or audiences when narrower values are possible.
- MUST NOT infer authorization directly from ungoverned external claims.

## SHOULD
- Federation SHOULD centralize authentication while preserving application-specific authorization boundaries.
- Metadata refresh and key rollover SHOULD be automated with safe fallback behavior.

## Exceptions
Exceptions require threat analysis, owner, compensating controls, expiry, and security approval.

## Verification
Inspect federation metadata, redirect URIs, claim mappings, token-validation configuration, rotation evidence, and negative security tests.