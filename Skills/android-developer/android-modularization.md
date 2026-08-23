# Android Modularization

## Purpose
Partition an Android codebase into modules that improve ownership, encapsulation, build isolation, and reuse without creating dependency sprawl or excessive ceremony.

## When to use
Use when a codebase grows across teams/features, build times degrade, boundaries erode, or shared code becomes unstable.

## Inputs
Current module graph, feature ownership, dependency cycles, build metrics, reuse needs, public APIs, release workflow.

## Preconditions
Measure current pain and identify desired boundary outcomes before splitting modules.

## Context to inspect
Gradle dependencies, package coupling, navigation, DI bindings, shared UI/domain/data code, test fixtures, and build profiles.

## Core knowledge
A module is a compilation and dependency boundary. Too few modules allow uncontrolled coupling; too many increase graph/configuration cost and API maintenance.

## Procedure
1. Map current feature and platform responsibilities.
2. Identify unstable cross-feature dependencies and cycles.
3. Group code by cohesive capability and ownership.
4. Define minimal public APIs for each boundary.
5. Keep implementation dependencies internal.
6. Separate reusable platform abstractions only when multiple features truly need them.
7. Move navigation/contracts to stable boundary modules when required.
8. Update DI without creating service-locator backdoors.
9. Measure clean and incremental build effects.
10. Add dependency rules or checks to prevent regression.

## Decision points
Use feature modules for independently owned/cohesive journeys; use core modules for genuinely shared stable capabilities. Do not create a module solely for a handful of files without a boundary benefit.

## Common failure patterns
Shared-common dumping grounds, cyclic modules, public-by-default APIs, module-per-layer explosion, duplicate models everywhere, and modularization that worsens build time.

## Verification
Compile all variants, run tests, inspect dependency graph for cycles/leaks, and compare representative build timings before and after.

## Expected output
Justified module graph, public boundary contracts, migration steps, and measured impact.

## Stop conditions
Escalate when ownership boundaries are unresolved, public API migration would break dependent products, or build tooling cannot support the proposed graph.