# Legacy Vue Migration

## Purpose
Migrate legacy Vue applications incrementally while preserving business behavior and controlling framework, dependency, and deployment risk.

## When to use
Use for Vue 2 to Vue 3 migrations, Options-to-Composition modernization, Vuex-to-Pinia transitions, or obsolete tooling replacement.

## Inputs
Current versions, dependency graph, build config, test coverage, browser support, and migration target.

## Context to inspect
Inspect deprecated APIs, plugins, global filters/mixins, custom directives, router/store versions, test tooling, and unsupported dependencies.

## Core knowledge
Migration risk comes from ecosystem compatibility and behavioral changes, not syntax alone. Incremental compatibility layers can reduce risk but should have an exit plan.

## Procedure
1. Inventory framework and dependency versions.
2. Identify incompatible/deprecated APIs and blocking packages.
3. Establish regression coverage for critical journeys.
4. Define migration slices and rollback points.
5. Upgrade tooling/dependencies in controlled stages.
6. Replace global patterns with explicit equivalents.
7. Migrate state and components without unrelated redesign.
8. Validate build, runtime, accessibility, and performance after each slice.
9. Remove compatibility layers after consumers migrate.
10. Document remaining debt and unsupported behavior.

## Decision points
Use incremental migration when system size/risk is high; a coordinated upgrade when codebase is small and dependencies are compatible. Do not combine architecture rewrite unless separately justified.

## Common failure patterns
Big-bang rewrite, changing framework and product behavior simultaneously, ignoring plugin compatibility, weak regression coverage, and leaving permanent compatibility shims.

## Verification
Run old/new behavior comparisons, critical E2E tests, production build, browser matrix, and performance checks.

## Expected output
A staged migration with verified behavioral continuity and decreasing legacy surface.

## Stop conditions
Stop when a critical dependency has no viable replacement or migration requires product behavior decisions without an owner.