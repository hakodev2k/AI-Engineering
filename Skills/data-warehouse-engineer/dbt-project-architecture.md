# dbt Project Architecture

## Purpose
Structure dbt-style transformation projects for clear ownership, reusable logic, safe dependencies, testing, and maintainable deployment at scale.

## When to use
Use when creating or refactoring modular SQL transformation projects, especially when model sprawl, duplicated logic, or unclear lineage emerges.

## Inputs
Repository, source domains, model dependencies, team ownership, deployment workflow, naming conventions, materialization constraints.

## Context to inspect
Existing staging/intermediate/mart layers, macros, sources, tests, exposures, model tags, packages, CI behavior, and warehouse conventions.

## Core knowledge
Transformation layers should separate source cleanup from business logic and consumption models. Reuse should reduce semantic duplication without creating opaque macro frameworks. Model contracts and tests should guard critical interfaces.

## Procedure
1. Inventory models and dependency graph.
2. Group sources and models by business domain and ownership.
3. Separate staging normalization from reusable transformations and marts.
4. Establish naming and materialization conventions.
5. Remove duplicated business logic through shared models or focused macros.
6. Define sources, freshness checks, and model contracts where valuable.
7. Add model-level documentation and ownership metadata.
8. Configure selective CI based on changed dependencies.
9. Review package dependencies and macro overrides.
10. Validate lineage and representative builds.

## Decision points
Prefer explicit SQL models over macros when readability is more valuable than abstraction. Use ephemeral models sparingly when debugging or repeated execution cost suffers. Materialize based on reuse, volume, and freshness.

## Common failure patterns
Monolithic models, excessive macros, circular conceptual dependencies, hidden cross-domain coupling, copy-pasted metric logic, and full-project builds for every small change.

## Verification
Run compilation, targeted builds, tests, documentation generation, and dependency inspection; confirm changed models produce expected outputs.

## Expected output
A modular transformation project with explicit layers, ownership, tests, and scalable CI behavior.

## Stop conditions
Stop refactoring when business semantics are not understood well enough to prove equivalent output.