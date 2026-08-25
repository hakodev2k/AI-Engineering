# Authorization and Access Control

## Purpose
Ensure every protected operation enforces the correct subject-resource-action relationship and tenant boundary.

## When to use
Use for new endpoints, privilege changes, RBAC/ABAC design, multi-tenant features, admin functions, and authorization incidents.

## Inputs
Permissions model, identities, resource ownership rules, API routes, policy code, tenancy model, and tests.

## Context to inspect
Inspect enforcement points, indirect object references, background jobs, bulk operations, internal APIs, admin tools, and data-layer filters.

## Core knowledge
Authorization must be server-side, deny-by-default, complete, and context-aware. Authentication claims are inputs to policy, not policy themselves. Object-level and function-level authorization require separate attention.

## Procedure
1. Build a matrix of actors, actions, resources, and constraints.
2. Identify all enforcement points and bypass paths.
3. Verify default-deny behavior and policy composition.
4. Test horizontal and vertical privilege escalation.
5. Test cross-tenant identifiers, bulk endpoints, exports, and nested resources.
6. Review privilege assignment and administrative delegation.
7. Ensure caches and asynchronous workers preserve authorization context safely.
8. Add negative tests before refactoring enforcement.
9. Log sensitive authorization decisions with appropriate privacy controls.

## Decision points
Use RBAC for stable job functions, ABAC/policy rules for contextual decisions, and explicit ownership checks for object access. Centralize common policy but keep domain-specific predicates close to domain semantics.

## Common failure patterns
UI-only restrictions, checking role but not object ownership, permissive fallback, tenant filters omitted in one code path, and trusting client-supplied identity fields.

## Verification
Run positive and negative tests for every privilege boundary and verify representative queries cannot return unauthorized objects.

## Expected output
An access-control model, corrected enforcement, regression tests, and residual-risk notes.

## Stop conditions
Escalate when business ownership rules are undefined, privileged production data is needed, or policy changes alter regulated segregation-of-duty requirements.