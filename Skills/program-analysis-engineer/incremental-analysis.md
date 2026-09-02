# Incremental Analysis

## Purpose
Recompute only the analysis state invalidated by a code or dependency change while preserving correctness and predictable latency.

## When to use
Use for IDE diagnostics, pre-commit analysis, monorepos, continuous scanning, and expensive whole-program analyses.

## Inputs
Dependency graph, cached analysis state, change set, build metadata, symbol/IR identities, and latency targets.

## Preconditions
Define stable identities for analyzed entities and explicit dependency/invalidation semantics.

## Context to inspect
File/module dependencies, symbol references, call graph, summaries, generated code, configuration, compiler flags, dependency versions, and analysis caches.

## Core knowledge
Incrementality is primarily an invalidation problem. Under-invalidation produces stale unsound results; over-invalidation destroys performance. Cache keys must include every semantic input that can change analysis meaning.

## Procedure
1. Enumerate analysis products that can be cached.
2. Record dependencies for each product.
3. Define stable content or semantic fingerprints.
4. Map source/config/dependency changes to affected products.
5. Invalidate transitively according to dependency semantics.
6. Recompute affected regions in dependency order.
7. Reuse unchanged summaries and graph regions.
8. Compare incremental output with clean full analysis.
9. Track cache hit rate, latency, and memory.
10. Add regression cases for subtle invalidation scenarios.

## Decision points
Use fine-grained invalidation where latency benefits justify metadata complexity; prefer module-level invalidation when analyses are cheap or dependencies are difficult to track safely.

## Common failure patterns
Ignoring compiler flags, stale call edges, unstable entity IDs, cache poisoning across versions, incomplete transitive invalidation, and accepting incremental/full mismatches.

## Verification
For randomized change sequences, compare incremental results byte-for-byte or semantically with clean full-analysis results and test cache-version migrations.

## Expected output
A correctness-preserving incremental pipeline with measured cache effectiveness and explicit invalidation rules.

## Stop conditions
Stop when semantic dependencies cannot be tracked reliably enough to prevent stale results.