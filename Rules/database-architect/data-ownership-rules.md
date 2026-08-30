# Data Ownership

## Purpose
Define accountable ownership and prevent cross-domain database coupling.

## Scope
Schemas, tables, datasets, database APIs, replication, and shared data dependencies.

## MUST
- Every authoritative dataset MUST have an accountable owner and defined consumers.
- Cross-domain access MUST use documented contracts and approved access paths.
- Ownership changes MUST include dependency analysis and migration responsibility.
- Shared reference data MUST define stewardship, update authority, and compatibility expectations.

## MUST NOT
- MUST NOT allow unmanaged direct writes by consumers into another domain's authoritative tables.
- MUST NOT create shared ownership where no party can approve schema or lifecycle changes.
- MUST NOT expose unrestricted database credentials as an integration mechanism.

## SHOULD
- Consumers SHOULD depend on stable views, APIs, events, or governed replicas rather than internal tables.
- Ownership boundaries SHOULD align with business capabilities and operational accountability.

## Exceptions
Exceptions require documented need, bounded access, rollback, auditability, and owner approval.

## Verification
Review grants, connection inventories, data contracts, ownership records, dependency maps, and audit logs.