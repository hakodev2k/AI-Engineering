# Row-Level Security

## Purpose
Design and validate row-level data authorization for BI systems so users see only permitted records without breaking analytical correctness.

## When to use
Use for tenant, region, department, customer, or managerial access restrictions in semantic/reporting layers.

## Inputs
Identity attributes, entitlement rules, organizational hierarchy, model relationships, authentication method, audit requirements.

## Context to inspect
Inspect identity provider claims, group membership, entitlement sources, semantic relationships, service accounts, exports, subscriptions, and cached artifacts.

## Core knowledge
RLS is authorization, not filtering convenience. Entitlements should be explicit, deny-by-default where appropriate, testable, and propagated through unambiguous model relationships.

## Procedure
1. Translate policy into explicit subject-resource rules.
2. Identify authoritative entitlement data and refresh requirements.
3. Choose static roles or dynamic identity mapping.
4. Model security relationships separately from business logic when that improves clarity.
5. Prevent ambiguous filter paths and accidental bypasses.
6. Handle administrators/service identities explicitly.
7. Test empty, multiple, expired, and hierarchical entitlements.
8. Verify exports, drill-through, subscriptions, APIs, and cached results respect policy.
9. Add auditability for entitlement changes and access where required.
10. Document operational ownership and emergency revocation path.

## Decision points
Use dynamic RLS for scalable attribute-based access; static roles for small stable partitions. Move enforcement closer to the data platform when multiple consumers must share the same security boundary.

## Common failure patterns
Testing only UI filters, permissive defaults, stale entitlement caches, many-to-many leakage, hidden service-account bypass, and security logic duplicated per report.

## Verification
Execute persona tests including negative cases and cross-tenant attempts. Confirm query results, exports, and downstream features cannot expose unauthorized rows.

## Expected output
Documented RLS design, entitlement lineage, test matrix, audit controls, and verified denial behavior.

## Stop conditions
Stop when policy is ambiguous, identity claims are untrusted, entitlement ownership is missing, or a proposed design cannot enforce required isolation.