# Content Pipeline and Data-Driven Design

## Purpose
Enable designers and content creators to author scalable gameplay content safely without requiring code changes for every variant.

## When to use
Use for items, enemies, abilities, quests, levels, balance data, localization references, or high-volume authored content.

## Inputs
Content types, authoring tools, schema needs, runtime loading model, validation requirements, source-control workflow, and patching strategy.

## Context to inspect
Inspect data formats, editor tooling, identifiers, references, import/build steps, validation, runtime conversion, and backward compatibility.

## Core knowledge
Data-driven design moves variation into validated content while code owns behavior and invariants. Stable schemas, identifiers, tooling feedback, and deterministic build transforms prevent content debt.

## Procedure
1. Separate behavioral logic from tunable/content variation.
2. Define explicit versioned schemas and stable IDs.
3. Create authoring constraints that prevent invalid combinations.
4. Validate references and ranges before runtime.
5. Convert authoring data into runtime-efficient formats when useful.
6. Provide actionable validation errors to creators.
7. Define migration for schema changes.
8. Keep generated/runtime artifacts reproducible.
9. Test representative and boundary content.
10. Measure content load and lookup cost at scale.

## Decision points
Use external/tabular data for bulk structured tuning, engine-native assets for rich references/editor integration, and generated runtime data when startup or lookup performance justifies a build step.

## Common failure patterns
Magic string IDs, no schema versioning, runtime discovery of authoring errors, code branches per content item, circular references, and generated files edited manually.

## Verification
Run validators across the full content set, rebuild from clean checkout, load boundary datasets, and test migrations.

## Expected output
A creator-friendly, validated, versioned content pipeline with predictable runtime behavior.

## Stop conditions
Stop when content ownership, schema compatibility policy, or build/patch pipeline constraints are unresolved.