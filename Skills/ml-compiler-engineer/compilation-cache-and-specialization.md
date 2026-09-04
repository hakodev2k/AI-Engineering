# Compilation Cache and Specialization

## Purpose
Design safe compilation caching and specialization strategies that reduce repeated compile cost without reusing artifacts across incompatible programs, shapes, devices, or compiler configurations.

## When to use
Use when compile latency is significant, dynamic shapes cause recompilation, deploying persistent artifact caches, or debugging stale/incorrect cache hits.

## Inputs
Graph identity, symbolic/static shapes, dtype/layout/device metadata, compiler flags, backend version, runtime ABI, cache telemetry.

## Context to inspect
Inspect cache-key construction, specialization guards, artifact versioning, eviction, persistence, concurrency, invalidation, shape buckets, and failure caching.

## Core knowledge
A compiler cache is correct only when its key captures every property that can change generated semantics or legality. Over-specific keys reduce hit rate; under-specific keys risk miscompilation. Persistent caches require explicit compiler/backend/ABI versioning.

## Procedure
1. Enumerate semantic and codegen inputs that affect compilation.
2. Separate stable graph identity from runtime specialization dimensions.
3. Define cache keys for graph, shape constraints, dtype, layout, device capability, compiler options, and relevant versions.
4. Define runtime guards for reusable symbolic artifacts.
5. Choose exact, bucketed, or symbolic specialization based on workload shape distribution.
6. Add deterministic artifact serialization and validation.
7. Define concurrency control for duplicate compilation.
8. Set bounded eviction and storage policies.
9. Invalidate incompatible artifacts across compiler, backend, or ABI changes.
10. Measure hit rate, miss causes, compile time saved, and cache size.
11. Test stale, corrupted, concurrent, and cross-device scenarios.

## Decision points
Use exact specialization for stable repeated shapes; symbolic compilation for highly variable shapes when backend support is mature; bucketing when exact specialization explodes cardinality but fully symbolic code is slower.

## Common failure patterns
Missing device capability in keys, unbounded shape-key growth, stale persistent artifacts, cache races, caching failed compilation indefinitely, and key changes that silently destroy hit rate.

## Verification
Run cache hit/miss tests, compatibility/version tests, cross-shape/device negative tests, concurrency tests, and measure end-to-end compile-latency reduction without correctness changes.

## Expected output
A bounded, versioned cache/specialization design with explicit keys, guards, invalidation rules, telemetry, and correctness/performance evidence.

## Stop conditions
Stop if artifact compatibility cannot be determined, specialization guards are incomplete, or persistent cache invalidation cannot be guaranteed across incompatible versions.