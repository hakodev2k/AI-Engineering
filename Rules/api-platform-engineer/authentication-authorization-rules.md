# Authentication and Authorization

## Purpose
Ensure API access is strongly authenticated and explicitly authorized.

## Scope
Identity propagation, tokens, scopes, policies, service identities, and privileged APIs.

## MUST
- Every protected operation MUST authenticate the caller and authorize the requested action.
- Authorization MUST be enforced server-side at the resource or capability boundary.
- Service identities MUST use least privilege and bounded credential lifetimes where supported.
- Authentication failures MUST avoid leaking sensitive identity details.

## MUST NOT
- MUST NOT rely on client UI controls for authorization.
- MUST NOT accept unsigned, expired, incorrectly scoped, or wrong-audience credentials.

## SHOULD
- Prefer centralized policy primitives with local resource-context enforcement.

## Exceptions
Any weakened control requires security approval, compensating controls, expiry, and evidence.

## Verification
Use policy tests, token-validation tests, negative authorization tests, configuration inspection, and security review.