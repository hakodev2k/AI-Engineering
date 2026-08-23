# Role and Entitlement Design Rules

## Purpose
Keep access models understandable, least-privileged, and maintainable over time.

## Scope
RBAC roles, groups, entitlement bundles, permission sets, and access catalogs.

## MUST
- Roles and entitlements MUST have clear names, owners, purpose, and included permissions.
- Role design MUST reflect stable responsibility patterns rather than individual exceptions.
- High-risk permissions MUST be identifiable within the catalog.
- Changes to shared roles MUST assess impact on all assigned identities.
- Obsolete and duplicate entitlements MUST be retired through controlled migration.

## MUST NOT
- MUST NOT create catch-all roles that accumulate unrelated privileges without governance.
- MUST NOT conceal privileged actions inside apparently low-risk bundles.
- MUST NOT use role proliferation to avoid fixing an unclear access model.

## SHOULD
- Frequently requested combinations SHOULD be modeled as reusable roles only when they represent legitimate responsibility patterns.
- Role mining SHOULD use observed access as evidence, not as automatic justification.

## Exceptions
One-off entitlements require owner, rationale, bounded duration, and periodic review.

## Verification
Inspect role catalog metadata, effective permissions, assignment patterns, change impact analysis, duplicate-role reports, and stale-role cleanup evidence.