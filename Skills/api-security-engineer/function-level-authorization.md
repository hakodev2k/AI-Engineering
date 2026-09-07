# Function-Level Authorization

## Purpose
Ensure callers can invoke only operations allowed by role, scope, entitlement, and business context, preventing privilege escalation through sensitive API functions.

## When to use
Use for administrative endpoints, workflow transitions, exports, impersonation, account management, support tooling, and destructive or privileged operations.

## Inputs
Role model, endpoint inventory, scopes/claims, business rules, audit requirements, gateway and application authorization configuration.

## Preconditions
Know which caller classes may execute each operation and under what conditions.

## Context to inspect
Routes, controller attributes, middleware, policy services, gateway rules, GraphQL resolvers, RPC handlers, hidden endpoints, API versions, feature flags, and background triggers.

## Core knowledge
Endpoint discoverability is not authorization. Use deny-by-default server-side enforcement. Coarse roles often need contextual policy, separation of duties, or stronger verification for high-impact actions.

## Procedure
1. Inventory operations and classify privilege level.
2. Map each operation to authorized subjects, scopes, and conditions.
3. Identify alternate routes, methods, versions, and resolver paths.
4. Enforce policy at a stable server-side boundary.
5. Add business-state checks where permission alone is insufficient.
6. Apply stronger controls to destructive or identity-changing actions.
7. Test normal users against every privileged function.
8. Test over-scoped tokens and stale role assignments.
9. Verify denials have no side effects.
10. Audit sensitive authorization decisions.

## Decision points
Use RBAC for stable coarse permissions, policy/attribute checks for contextual rules, and approval workflows for exceptional high-risk operations. Gateway enforcement can supplement but should not replace application checks when business state matters.

## Common failure patterns
Hidden admin routes, authentication-only checks, inconsistent policy across versions, internal-network trust, wildcard scopes, or missing resolver-level checks.

## Verification
Run a permission matrix with positive and negative tests. Confirm unauthorized callers are denied consistently and privileged actions produce auditable evidence.

## Expected output
A verified function-authorization matrix, consistent enforcement, negative tests, and audit coverage.

## Stop conditions
Escalate when permission ownership is unclear, current roles cannot express required separation, or remediation would revoke business-critical access without approval.