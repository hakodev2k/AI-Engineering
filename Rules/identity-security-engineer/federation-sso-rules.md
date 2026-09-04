# Federation and SSO Rules

## Purpose
Protect federated trust and single sign-on integrations from overbroad trust, token misuse, and configuration drift.

## Scope
Applies to identity-provider and service-provider federation, enterprise SSO, partner federation, and cross-domain trust.

## MUST
- Every federation trust MUST define issuer, audience, accepted algorithms, endpoints, attributes, and trust owner.
- Signing keys and metadata MUST be validated through trusted distribution channels.
- Claims used for authorization MUST have documented source, semantics, and integrity assumptions.
- Federation changes MUST be tested for unintended access expansion and lockout risk.
- Trust relationships MUST be periodically reviewed for continued necessity.

## MUST NOT
- Wildcard audiences, redirect targets, or unrestricted trust patterns MUST NOT be used without explicit risk review.
- Unsigned or weakly validated assertions MUST NOT grant access.
- External identity claims MUST NOT be mapped to privileged roles without controlled policy.

## SHOULD
- Prefer short-lived assertions and automated metadata/key rotation where operationally safe.
- Separate authentication federation from authorization policy ownership.

## Exceptions
Exceptions require written rationale, bounded scope, compensating controls, expiry, and approval.

## Verification
Inspect federation metadata, protocol configuration, claim mappings, trust inventories, test assertions, and access-review evidence.