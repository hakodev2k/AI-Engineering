# Gateway Policy

## Purpose
Keep edge enforcement consistent without turning the gateway into hidden business logic.

## Scope
Routing, TLS, authentication integration, quotas, headers, transformations, and edge controls.

## MUST
- Gateway policies MUST be declarative, version-controlled, reviewable, and environment-aware.
- Security-critical policies MUST fail closed unless an approved availability design requires otherwise.
- Routing changes MUST have rollback and health verification.

## MUST NOT
- MUST NOT place domain decisions or stateful workflows in gateway configuration.
- MUST NOT bypass platform security controls to unblock a release.
- MUST NOT mutate payload semantics invisibly to consumers.

## SHOULD
- Shared policies SHOULD be centrally reusable with narrowly scoped overrides.

## Exceptions
Overrides require owner, reason, risk, expiry when temporary, and approval.

## Verification
Inspect policy diffs, gateway tests, route probes, security tests, and rollback evidence.