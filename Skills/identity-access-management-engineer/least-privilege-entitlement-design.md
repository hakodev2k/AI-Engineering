# Least-Privilege Entitlement Design

## Purpose
Design entitlements that grant the minimum practical access required while remaining understandable, requestable, reviewable, and maintainable.

## When to use
Use when creating roles/groups, rationalizing permissions, onboarding applications, reducing privilege, or remediating toxic combinations.

## Inputs
Job functions, resources, actions, existing grants, usage evidence, regulatory constraints, business owners, and segregation-of-duties rules.

## Context to inspect
Inspect direct grants, nested groups, inherited permissions, dormant entitlements, role bundles, exceptions, privileged permissions, and actual access usage.

## Core knowledge
Least privilege is not simply minimizing permission count. Entitlements need useful business meaning, clear ownership, appropriate granularity, and a lifecycle. Excessive granularity creates governance failure; excessive bundling creates overprivilege.

## Procedure
1. Inventory effective access, not only configured grants.
2. Group permissions by coherent business capability.
3. Identify sensitive and privileged actions.
4. Remove obsolete and duplicate entitlements.
5. Design baseline roles from common legitimate access.
6. Keep exceptional access explicit and time-bound where possible.
7. Detect conflicting or toxic permission combinations.
8. Assign an accountable owner to each entitlement.
9. Define request, approval, review, and retirement rules.
10. Validate against real job scenarios and usage evidence.

## Decision points
Bundle permissions when they are consistently required together; keep high-risk permissions separate. Use birthright access sparingly for low-risk universal needs.

## Common failure patterns
Role explosion, nested groups nobody understands, direct grants bypassing governance, entitlement names without business meaning, permanent exceptions, and optimizing only for provisioning convenience.

## Verification
Compare representative users' effective access with documented job needs and verify sensitive permissions require explicit justified paths.

## Expected output
A governed entitlement catalog with roles, sensitive permissions, owners, lifecycle rules, and least-privilege evidence.

## Stop conditions
Stop when business ownership is unavailable, effective permissions cannot be determined, or reducing access risks critical operations without validation.