# Object-Level Authorization

## Purpose
Prevent callers from accessing or modifying resources they do not own or otherwise lack permission to use. This addresses one of the most damaging API failure classes: broken object-level authorization.

## When to use
Use whenever an endpoint accepts or derives a resource identifier, tenant identifier, account identifier, document key, order ID, or other object reference.

## Inputs
- Resource model
- Identity and claims model
- Authorization requirements
- Endpoint contracts
- Tenant and ownership rules
- Data-access implementation

## Preconditions
Know which principals may perform which actions on which objects under which conditions.

## Context to inspect
Inspect route parameters, query parameters, body identifiers, ORM filters, repository methods, indirect references, nested resources, bulk endpoints, caches, and background operations.

## Core knowledge
Possession of an identifier is not proof of authorization. Checks must bind the authenticated principal, requested action, resource, and contextual constraints. Authorization should be enforced server-side and consistently across read, write, list, export, batch, and asynchronous paths.

## Procedure
1. Build a subject-action-resource authorization matrix.
2. Identify every externally controllable object reference.
3. Trace each reference to the data-access layer.
4. Ensure queries constrain by both object identity and caller scope where possible.
5. Centralize reusable policy logic without hiding business-specific rules.
6. Cover nested and bulk operations explicitly.
7. Define behavior for missing versus unauthorized resources to avoid unnecessary enumeration.
8. Add tests using valid IDs belonging to other users, roles, or tenants.
9. Test stale permissions and privilege changes.
10. Instrument denied access and suspicious enumeration patterns.

## Decision points
Prefer query-time scoping when it naturally enforces tenant or ownership boundaries. Use policy services for richer contextual rules. Avoid relying only on UI filtering, gateway scopes, or opaque IDs.

## Common failure patterns
- Checking role but not object ownership
- Authorizing parent resources but not children
- Missing checks on update or delete
- Bulk operations bypassing per-object rules
- Cache entries crossing tenants
- Trusting client-supplied tenant IDs

## Verification
Run positive and negative authorization tests across roles and tenants. Confirm direct database or service queries cannot return out-of-scope objects. Review logs for unauthorized attempts without sensitive leakage.

## Expected output
A verified object-access control design and implementation with explicit policies, negative tests, and tenant-safe data access.

## Stop conditions
Escalate when ownership semantics are ambiguous, authorization depends on unavailable authoritative data, or fixing the issue requires a breaking data-model change.