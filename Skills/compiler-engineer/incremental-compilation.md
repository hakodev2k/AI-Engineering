# Incremental Compilation

## Purpose
Reuse prior compilation work safely after edits while preserving results equivalent to a clean build.

## When to use
Use for IDE compilers, build acceleration, module caches, dependency invalidation bugs, or stale-output incidents.

## Inputs
Dependency graph, compiler stages, cache keys, edit model, build artifacts, clean-vs-incremental repro.

## Context to inspect
Symbol/module dependencies, fingerprints, generated artifacts, semantic caches, filesystem timestamps, configuration/environment inputs.

## Core knowledge
Incrementality is an invalidation problem. Cache correctness requires all semantic inputs in keys or dependency edges. Clean and incremental builds must be observationally equivalent.

## Procedure
1. Define cacheable units and observable outputs.
2. Enumerate every input affecting each unit.
3. Build explicit dependency edges/fingerprints.
4. Separate content identity from timestamps where reliability matters.
5. Invalidate transitively only where semantics require it.
6. Bound cache size and version formats.
7. Test edit sequences: body, signature, import, config, target, generated source.
8. Compare incremental outputs with clean rebuilds automatically.

## Decision points
Use coarse invalidation for simpler correctness; refine granularity only when profiling shows meaningful rebuild cost. Persist caches only with robust versioning.

## Common failure patterns
Missing configuration keys, timestamp races, stale semantic symbols, dependency cycles handled inconsistently, cache format incompatibility, nondeterministic fingerprints.

## Verification
Randomized edit/rebuild differential tests, clean-build equivalence, cache hit metrics, and corruption recovery tests.

## Expected output
Correct incremental behavior with explicit dependency/invalidation rules and measurable benefit.

## Stop conditions
Disable/rebuild caches when equivalence cannot be proven or cache corruption is detected.