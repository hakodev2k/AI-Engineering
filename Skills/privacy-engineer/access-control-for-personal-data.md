# Access Control for Personal Data

## Purpose
Limit personal-data access to identities, services, purposes, and time windows that genuinely require it.

## When to use
Use when designing authorization, admin tools, support access, analytics access, or sensitive-data stores.

## Inputs
Roles, service identities, data classes, purposes, workflows, emergency-access requirements, and audit capabilities.

## Context to inspect
Inspect broad groups, shared credentials, service principals, production consoles, data warehouses, exports, and privilege inheritance.

## Core knowledge
Least privilege should apply to humans and machines. Row, column, tenant, purpose, and environment boundaries may all matter. Audit logs are detective controls, not substitutes for prevention.

## Procedure
1. Classify data and operations.
2. Map legitimate actors and purposes.
3. Remove standing access where just-in-time access works.
4. Scope service identities to minimum datasets and actions.
5. Enforce tenant and subject boundaries close to data access.
6. Protect privileged support workflows.
7. Add approval and expiry for exceptional access.
8. Log access metadata without duplicating sensitive content.
9. Review entitlements periodically.

## Decision points
Use attribute- or policy-based authorization when role-only models cannot express data/purpose boundaries clearly.

## Common failure patterns
Shared admin accounts, broad warehouse access, authorization only in UI, permanent break-glass access, and stale privileges.

## Verification
Test denied paths and cross-tenant access, then reconcile effective privileges with approved needs.

## Expected output
A least-privilege access model with auditable exceptions.

## Stop conditions
Escalate when required isolation cannot be enforced or ownership of privileged access is unclear.