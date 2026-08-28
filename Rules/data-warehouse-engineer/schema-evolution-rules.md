# Schema Evolution Rules

## Purpose
Prevent unsafe warehouse schema changes and preserve downstream compatibility.

## Scope
Applies to table, view, column, type, partition, constraint, and contract changes.

## MUST
- Schema changes MUST classify backward compatibility and affected consumers before deployment.
- Destructive changes MUST use an approved migration plan with rollback or recovery steps.
- Type narrowing, column removal, and semantic repurposing MUST require explicit impact analysis.
- Multi-step migrations MUST define coexistence periods and completion criteria.

## MUST NOT
- MUST NOT drop or repurpose a production field solely because current code search finds no references.
- MUST NOT combine irreversible data transformation and contract removal without validated recovery evidence.

## SHOULD
- Prefer additive changes followed by measured deprecation.
- Consumer migration SHOULD be observable before old contracts are removed.

## Exceptions
Emergency changes require owner approval, documented risk, and post-change validation.

## Verification
Inspect migration scripts, dependency/lineage reports, consumer tests, backups, and post-deployment checks.