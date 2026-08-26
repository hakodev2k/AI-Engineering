# Module Linking and Composition

## Purpose
Compose Wasm modules/components without fragile coupling, duplicate runtime state, or unresolved imports.

## When to use
Use for plugin systems, multi-module applications, dynamic composition, shared libraries, or linker/instantiation failures.

## Inputs
Module/component graph, imports/exports, build/link settings, shared state requirements, runtime capabilities, and version constraints.

## Context to inspect
Inspect dependency graph, symbol visibility, import modules, memories/tables, initialization order, adapters, and component worlds.

## Core knowledge
Core Wasm linking is host-mediated unless tooling statically links modules. Components provide higher-level typed composition. Sharing memory/table state changes isolation and lifecycle assumptions. Initialization order can be observable.

## Procedure
1. Draw the dependency and capability graph.
2. Identify stable public interfaces and private implementation symbols.
3. Decide static linking, host-mediated module linking, or component composition.
4. Resolve ownership of memories, tables, allocators, and runtime support code.
5. Make initialization order explicit.
6. Detect dependency cycles and version conflicts.
7. Validate every composed unit independently.
8. Test partial failure during instantiation.
9. Measure duplication, startup cost, and binary size.
10. Add compatibility tests for independently versioned pieces.

## Decision points
Prefer static linking for simple deployment and optimization; dynamic composition for independent lifecycle or plugins. Share state only when necessary; isolated memories improve reasoning and security.

## Common failure patterns
Duplicate allocators/runtimes; circular imports; mismatched function types; accidental symbol exposure; relying on undocumented initialization order; versioning modules without versioning their contracts.

## Verification
Instantiate from a clean host, test missing/incompatible dependencies, confirm state ownership, and run composition tests across supported versions.

## Expected output
A documented composition model with explicit contracts, lifecycle, state ownership, and verified dependency compatibility.

## Stop conditions
Stop if cyclic ownership cannot be resolved, composition requires unsupported proposals, or shared state would violate isolation requirements.