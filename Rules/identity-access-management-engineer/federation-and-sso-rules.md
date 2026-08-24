# Federation and SSO Rules

## Purpose
Establish federation without creating ambiguous or excessive trust.

## Scope
SAML, OpenID Connect, OAuth-based sign-in, enterprise federation, partner trust, and SSO integrations.

## MUST
- Federation MUST validate issuer, audience, signature, validity period, and required protocol protections.
- Attribute and group mappings MUST have documented semantics and authoritative sources.
- New federation trusts MUST document blast radius, tenant boundaries, deprovisioning behavior, and rollback.
- Metadata and signing-key rollover MUST be tested before expiry windows become operational risks.

## MUST NOT
- MUST NOT accept wildcard redirect destinations or unbounded audiences.
- MUST NOT map untrusted external attributes directly to privileged roles.
- MUST NOT disable signature or state/nonce validation to resolve integration failures.

## SHOULD
- Prefer automated metadata/key rollover and narrowly scoped claims.

## Exceptions
Legacy protocol exceptions require threat assessment, compensating controls, migration plan, expiry, and security approval.

## Verification
Use protocol traces, configuration inspection, negative tests, claim-mapping tests, key-rollover exercises, and trust inventory review.