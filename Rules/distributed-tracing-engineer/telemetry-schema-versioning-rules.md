# Telemetry Schema and Versioning Rules

## Purpose
Keep trace semantics compatible and analyzable as instrumentation evolves.

## Scope
Applies to attribute names, event names, resource metadata, semantic conventions, derived fields, and dashboards that consume them.

## MUST
- Breaking telemetry schema changes MUST be identified before release.
- Producers and consumers of shared tracing fields MUST have a migration strategy when semantics or types change.
- Attribute meaning MUST remain stable within a documented version or convention set.
- Deprecated fields MUST have a defined removal criterion and observation period.

## MUST NOT
- MUST NOT silently reuse an existing attribute name for a different meaning.
- MUST NOT change units, types, or normalization rules without updating dependent queries and validation.
- MUST NOT assume backend dashboards automatically remain correct after semantic-convention upgrades.

## SHOULD
- Prefer additive evolution before destructive removal.
- Shared instrumentation packages SHOULD pin or explicitly manage semantic-convention versions.

## Exceptions
Exceptions require impact analysis, affected consumers, migration sequencing, rollback plan, and technical approval.

## Verification
Run schema-contract tests, compare emitted telemetry across versions, inspect saved queries and dashboards, and verify deprecated-field usage before removal.
