# Authorization Rules

## Purpose
Enforce authorization consistently across GraphQL operations and field resolution.

## Scope
Applies to queries, mutations, subscriptions, nested fields, loaders, and service calls.

## MUST
- Authorization MUST be enforced at a layer that cannot be bypassed by alternate GraphQL traversal paths.
- Object and field-level access decisions MUST account for tenant, ownership, role, and policy context as required by the domain.
- Mutation authorization MUST be evaluated before state changes execute.
- Loader batching and caches MUST preserve caller authorization boundaries.
- Authorization failures MUST be observable without logging sensitive credentials.

## MUST NOT
- MUST NOT rely solely on UI visibility or client behavior for access control.
- MUST NOT assume parent-object authorization automatically authorizes all child fields.
- MUST NOT reuse privileged resolver paths for lower-privilege callers without explicit policy checks.

## SHOULD
- SHOULD centralize reusable policy evaluation while keeping domain-specific rules explicit.
- SHOULD test both allowed and denied traversal paths.

## Exceptions
Any deliberate policy bypass requires explicit human approval, documented scope, expiry, compensating controls, and audit evidence.

## Verification
Use authorization matrix tests, negative integration tests, policy inspection, audit-log review, and security testing.