# Dependency and React Upgrades

## Purpose
Upgrade React, framework, build tooling, and packages safely while controlling compatibility and regression risk.

## When to use
Use for security updates, major React/framework upgrades, deprecated APIs, or dependency modernization.

## Inputs
Current dependency graph, changelogs/migration guides, test coverage, browser/runtime support.

## Preconditions
Have reproducible build/tests and a rollback path.

## Context to inspect
Lockfile, peer dependencies, deprecated APIs, bundler config, runtime warnings, transitive duplicates.

## Core knowledge
Major frontend upgrades can change rendering semantics, build output, type definitions, browser support, and third-party compatibility.

## Procedure
1. Inventory direct and high-risk transitive dependencies.
2. Read official migration notes for major changes.
3. Upgrade foundational packages in controlled groups.
4. Resolve peer/version constraints explicitly.
5. Remove deprecated patterns rather than suppress warnings.
6. Run typecheck, unit, integration, and E2E tests.
7. Compare production bundle and performance.
8. Roll out progressively where possible.

## Decision points
Avoid opportunistic unrelated refactors during high-risk upgrades unless required by migration.

## Common failure patterns
Updating everything at once, ignoring peer warnings, relying only on compile success, missing runtime/browser regressions.

## Verification
Production build, test suites, bundle diff, smoke test on supported browsers, and post-deploy monitoring.

## Expected output
A controlled, reversible dependency upgrade with verified compatibility.

## Stop conditions
Stop if a critical dependency is unmaintained or incompatible and replacement requires architectural decision.