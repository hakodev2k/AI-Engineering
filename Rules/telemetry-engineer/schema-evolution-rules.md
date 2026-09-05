# Schema Evolution Rules

## Purpose
Evolve telemetry schemas without breaking collectors, queries, alerts, or historical interpretation.

## Scope
Field additions, removals, renames, type changes, enumerations, event versions, and semantic changes.

## MUST
- Breaking schema changes MUST use explicit versioning or a staged migration.
- Producers and consumers MUST define compatibility expectations before deployment.
- Type or semantic changes MUST include downstream impact analysis and migration evidence.
- Deprecated fields MUST have a documented removal criterion and consumer inventory where practical.

## MUST NOT
- MUST NOT rename or remove consumer-critical fields without migration.
- MUST NOT change field type in place when existing consumers can misinterpret it.
- MUST NOT reuse a retired field name for unrelated meaning.

## SHOULD
- Prefer additive, backward-compatible changes.

## Exceptions
Require documented urgency, affected consumers, containment, rollback or recovery, and approval.

## Verification
Review schemas, compatibility tests, consumer queries, deployment order, deprecation records, and sample events.