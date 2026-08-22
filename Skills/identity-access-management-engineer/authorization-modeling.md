# Authorization Modeling

## Purpose
Translate business access rules into explicit, least-privilege authorization models that remain understandable as systems scale.

## When to use
Use when introducing roles, permissions, resource policies, tenant boundaries, entitlements, or redesigning inconsistent authorization.

## Inputs
Actors, resources, actions, business rules, ownership relationships, tenant model, regulatory constraints, and current permissions.

## Context to inspect
Inspect enforcement points, role definitions, permission inheritance, resource ownership, privileged operations, policy engines, data filters, and administrative delegation.

## Core knowledge
RBAC is simple and auditable for stable job functions; ABAC handles contextual attributes; relationship-based authorization captures graph-like ownership/sharing. Real systems often combine models, but complexity must remain governable.

## Procedure
1. Enumerate protected resources and sensitive actions.
2. Identify actor categories and ownership relationships.
3. Express policy independently from implementation.
4. Choose RBAC, ABAC, relationship-based, or a justified hybrid.
5. Default to deny and define explicit grants.
6. Separate administrative permissions from business permissions.
7. Define tenant and data-scope boundaries.
8. Centralize reusable policy where practical.
9. Add negative authorization tests.
10. Define review and deprecation processes.

## Decision points
Use RBAC when roles map cleanly to stable responsibilities; ABAC for contextual rules; relationship-based models for sharing/ownership graphs. Avoid hybrid complexity unless simpler models fail requirements.

## Common failure patterns
Role explosion, permission checks only in UI, implicit superuser paths, missing tenant filters, duplicated policy logic, authorization based on mutable display attributes, and fail-open behavior.

## Verification
Test allow and deny matrices, cross-tenant attempts, privilege escalation, stale claims, administrative delegation, and direct API access.

## Expected output
A documented authorization model with resources, actions, policy rules, enforcement points, tests, and ownership.

## Stop conditions
Stop when business policy is contradictory, resource ownership is unresolved, or enforcement cannot be placed on a trusted server-side boundary.