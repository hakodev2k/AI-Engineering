# Build System Migration

## Purpose
Migrate build tooling or target definitions without silently changing artifacts, supported workflows, or correctness.

## When to use
Use when replacing legacy build systems, consolidating multiple systems, or adopting remote/cached execution capabilities.

## Inputs
Old build definitions, desired system, artifact contracts, target inventory, CI workflows, performance baselines, and consumer requirements.

## Context to inspect
Inspect outputs, flags, generated files, dependency semantics, platform matrix, packaging, tests, developer commands, and release integration.

## Core knowledge
A build migration is a behavior migration, not syntax translation. Parity must cover artifacts, flags, dependency ordering, platform behavior, and operational workflows. Incremental migration reduces risk when dual-build comparison is possible.

## Procedure
1. Inventory canonical targets and externally consumed artifacts.
2. Capture old-system clean/incremental outputs and timings.
3. Define migration invariants and accepted intentional differences.
4. Build foundational toolchain/dependency rules in the new system.
5. Migrate coherent target slices with their tests.
6. Run old and new builds in parallel for parity comparison.
7. Compare artifacts, symbols, tests, packaging, and runtime behavior.
8. Move CI/release consumers only after evidence is sufficient.
9. Remove dual maintenance promptly after cutover.
10. Delete obsolete scripts/config and document new workflows.

## Decision points
Use big-bang migration only for small, well-understood graphs. Prefer incremental slices for large repositories. Compatibility wrappers are temporary bridges, not permanent architecture.

## Common failure patterns
Line-by-line translation, unmeasured flag drift, indefinite dual systems, missing generated targets, and declaring success because compilation passes.

## Verification
Compare old/new outputs and behavior for representative configurations; execute clean/incremental builds; validate CI/release paths; measure performance.

## Expected output
A staged migration plan, parity evidence, cutover criteria, and retired legacy paths.

## Stop conditions
Stop when artifact parity requirements are unknown, release consumers cannot be tested, or migration exposes incompatible behavior needing product/platform approval.