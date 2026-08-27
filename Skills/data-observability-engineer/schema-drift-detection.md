# Schema Drift Detection

## Purpose
Detect structural changes that can silently corrupt downstream transformations, contracts, and analytics.

## When to use
Use for external sources, CDC, APIs, event payloads, lake files, warehouse tables, and shared data products whose schemas may evolve.

## Inputs
Current and historical schemas, data contracts, parser configuration, compatibility rules, downstream dependencies.

## Preconditions
Canonical field names, types, nullability, and compatibility expectations must be discoverable.

## Context to inspect
Inspect source contracts, serialization formats, schema registries, transformation assumptions, warehouse DDL, consumers, and migration history.

## Core knowledge
Schema changes may be additive, compatible, breaking, or semantically breaking despite structural compatibility. Type widening, nullability changes, enum expansion, nested-field movement, and unit changes require different handling.

## Procedure
1. Capture canonical schema snapshots at trusted boundaries.
2. Compare incoming schemas against approved versions.
3. Classify additions, removals, type changes, nullability changes, and nesting changes.
4. Map changes to downstream consumers through lineage.
5. Apply compatibility rules appropriate to the serialization and storage technology.
6. Quarantine or fail closed for high-risk breaking changes.
7. Route low-risk additive changes through controlled review when required.
8. Record schema versions and change metadata.
9. Test forward and backward compatibility with representative consumers.
10. Retire temporary compatibility paths after migration.

## Decision points
Allow additive changes automatically only when consumers tolerate unknown fields. Fail fast when silent coercion can alter meaning. Use schema registries when event contracts are shared broadly.

## Common failure patterns
- Checking column names but not types
- Ignoring nested schemas
- Treating semantic changes as structurally safe
- Auto-evolving warehouse schemas without consumer analysis
- No lineage from changed field to affected products

## Verification
Introduce controlled compatible and breaking schema changes and verify classification, alerting, quarantine, and consumer tests.

## Expected output
Versioned schema monitoring, compatibility policy, impact context, and validated response behavior.

## Stop conditions
Escalate when a breaking change affects unmanaged consumers or when semantic intent of the changed field is unknown.