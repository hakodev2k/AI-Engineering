# RBAC and ABAC Design

## Purpose
Design maintainable authorization using roles, attributes, relationships, or hybrids while minimizing privilege and policy sprawl.

## When to use
Use for application authorization, enterprise access models, entitlement cleanup, or policy redesign.

## Inputs
Business functions, resources, actions, attributes, risk tiers, separation-of-duties rules, ownership.

## Context to inspect
Current roles, groups, claims, permissions, policy engines, access reviews, exception history, usage evidence.

## Core knowledge
RBAC scales through stable job functions; ABAC scales through reliable attributes and contextual policy. Both fail when source data or ownership is weak.

## Procedure
1. Model resources and actions first.
2. Identify stable business responsibilities.
3. Separate birthright, requestable, privileged, and emergency access.
4. Define least-privilege permission sets.
5. Introduce attributes only when authoritative and testable.
6. Encode separation-of-duties constraints.
7. Define inheritance and conflict semantics.
8. Add expiry for temporary grants.
9. Test representative allow/deny cases.
10. Review role/attribute drift using actual usage.

## Decision points
Prefer RBAC for explainable stable functions; ABAC for dynamic context; hybrid models when both are required.

## Common failure patterns
Role explosion, nested groups without ownership, stale attributes, deny rules with unclear precedence, and permissions granted directly to individuals.

## Verification
Run policy tests for expected grants, denials, conflicts, expired access, and cross-tenant boundaries.

## Expected output
Authorization model, policy rules, ownership, test cases, and migration plan.

## Stop conditions
Escalate when required attributes are unreliable or policy conflicts cannot be deterministically resolved.