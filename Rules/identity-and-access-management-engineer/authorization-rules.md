# Authorization Rules

## Purpose
Ensure access decisions enforce approved business policy and least privilege.

## Scope
Roles, groups, policies, entitlements, scopes, claims, and runtime authorization decisions.

## MUST
- Authorization policy MUST be defined separately from authentication success.
- Access grants MUST map to documented job, service, or business responsibilities.
- High-impact permissions MUST require stronger approval and periodic review.
- Runtime authorization MUST fail closed when required policy inputs are unavailable or invalid.
- Policy changes MUST be versioned, reviewable, and attributable.

## MUST NOT
- MUST NOT infer authorization solely from network location or successful sign-in.
- MUST NOT grant broad wildcard permissions when narrower permissions satisfy the requirement.
- MUST NOT leave deprecated roles or entitlements active without ownership and justification.

## SHOULD
- Policy SHOULD be centrally governed with local enforcement where architecture requires it.
- Attribute-based decisions SHOULD use authoritative, freshness-bounded attributes.

## Exceptions
Exceptions require scope, business justification, risk, compensating controls, approver, and expiry.

## Verification
Inspect policy definitions, entitlement catalogs, sample effective-permission calculations, denial tests, change history, and access-review evidence.