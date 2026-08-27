# Monorepo Build Scaling

## Purpose
Scale build discovery, dependency analysis, caching, testing, and execution as a repository grows in targets and teams.

## When to use
Use when monorepo build latency, graph loading, broad invalidation, or ownership coupling becomes costly.

## Inputs
Repository graph, target counts, ownership boundaries, build traces, dependency patterns, CI workflows, and change-frequency data.

## Context to inspect
Inspect graph loading, package boundaries, global configuration, broad globs, shared generators, test selection, dependency fan-out, and cache namespaces.

## Core knowledge
Monorepo scale problems often come from graph shape and global invalidation, not repository size alone. Stable ownership boundaries and precise dependencies enable selective builds.

## Procedure
1. Measure graph-loading, analysis, execution, and test-selection costs separately.
2. Map high fan-in/fan-out targets and global inputs.
3. Define stable package/target ownership boundaries.
4. Replace unnecessary repository-wide inputs with scoped dependencies.
5. Partition generated artifacts and output roots.
6. Implement affected-target computation from graph evidence.
7. Improve caching for shared expensive targets.
8. Parallelize independent domains without duplicating canonical build logic.
9. Add graph health metrics such as dependency depth and fan-out.
10. Reassess boundaries as repository topology evolves.

## Decision points
Centralize truly shared primitives; duplicate tiny abstractions when centralization would create massive invalidation coupling. Use partial graph loading only when correctness of dependency discovery is maintained.

## Common failure patterns
Global config files invalidating everything, giant aggregate targets, implicit cross-package imports, directory-wide globs, and optimizing CI while developer graph loading remains slow.

## Verification
Measure representative small and large changes; confirm affected-target selection against clean full builds; track graph analysis time and cache hit rates.

## Expected output
A scalable target topology, scoped invalidation, affected-target strategy, and measurable graph/build health indicators.

## Stop conditions
Stop when organizational ownership changes are required but unapproved, or dependency discovery cannot prove selective-build correctness.