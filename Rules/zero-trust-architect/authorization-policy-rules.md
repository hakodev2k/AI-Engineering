# Authorization Policy Rules

## Purpose
Define enforceable authorization policies that minimize implicit trust and privilege accumulation.

## Scope
Applies to application, API, infrastructure, administrative, data, and workload authorization.

## MUST
- Authorization MUST be based on explicit policy evaluating subject, resource, action, and relevant context.
- Default behavior for protected resources MUST be deny unless access is explicitly permitted.
- Policies MUST use the least privilege needed for the task and MUST distinguish administrative, write, read, export, and destructive actions where risk differs.
- Sensitive authorization decisions MUST be evaluated using current identity and risk context rather than only login-time state.
- Policy ownership, versioning, change review, and rollback MUST be defined.
- Authorization failures MUST be observable without exposing sensitive policy internals to unauthorized callers.

## MUST NOT
- Broad wildcard permissions MUST NOT be granted without documented necessity and review.
- Authorization MUST NOT rely solely on UI hiding, network reachability, client-side checks, or undocumented group conventions.
- Historical group membership MUST NOT remain effective after authoritative access revocation.
- Emergency permissions MUST NOT become permanent by omission.

## SHOULD
- Attribute-based or relationship-aware policy SHOULD be used when coarse role-based access cannot express the required boundaries.
- High-risk privileges SHOULD be time-bounded and just-in-time where feasible.
- Policies SHOULD be human-readable enough for independent review.

## Exceptions
Exceptions require reason, exact scope, duration, risk assessment, compensating controls, approval, and post-expiry validation.

## Verification
Inspect policy definitions, entitlement inventories, access reviews, negative tests, role mappings, audit logs, and revocation behavior. Verify unauthorized subjects cannot access protected actions through alternate interfaces.