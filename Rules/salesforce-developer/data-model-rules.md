# Data Model Rules

## Purpose
Protect long-term data integrity, queryability, and maintainability of Salesforce schema design.

## Scope
Applies to standard/custom objects, fields, relationships, record types, formulas, and ownership models.

## MUST
- New schema elements MUST have a clear business owner, semantics, and lifecycle.
- Relationship choices MUST account for ownership, sharing, delete behavior, reporting, and expected cardinality.
- Schema changes affecting integrations or automation MUST be assessed for backward compatibility.
- High-volume objects MUST be designed with query selectivity, storage growth, and archival needs in mind.

## MUST NOT
- MUST NOT create duplicate fields with ambiguous meaning when an existing canonical field can be extended safely.
- MUST NOT repurpose fields in ways that invalidate historical semantics without migration and stakeholder approval.
- MUST NOT make destructive schema changes without impact analysis and rollback or recovery planning.

## SHOULD
- Data models SHOULD favor stable business concepts over transient UI needs.
- Record types SHOULD be introduced only when behavior or process differences justify them.

## Exceptions
Exceptions require documented trade-offs, migration impact, and approval.

## Verification
Review schema diffs, dependency analysis, data volume, reports, integrations, and migration tests.