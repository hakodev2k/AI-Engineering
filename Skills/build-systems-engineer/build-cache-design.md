# Build Cache Design

## Purpose
Design correct local and shared build caches that reduce repeated work without serving stale or unsafe artifacts.

## When to use
Use when build actions are expensive and sufficiently deterministic, or when diagnosing low cache hit rates or suspicious cache hits.

## Inputs
Action definitions, input digests, toolchain metadata, environment, cache telemetry, artifact sizes, network characteristics, and security boundaries.

## Context to inspect
Inspect action-key construction, declared inputs, compiler flags, platform properties, toolchain identity, environment variables, output determinism, cache eviction, and trust boundaries.

## Core knowledge
A cache key must represent every input capable of changing an output. False hits are correctness failures; false misses waste time. Shared caches introduce authentication, poisoning, tenancy, bandwidth, and retention concerns.

## Procedure
1. Identify expensive deterministic actions.
2. Enumerate all output-affecting inputs for each action.
3. Define canonical action keys using content digests and relevant platform/toolchain properties.
4. Exclude volatile values that do not affect outputs.
5. Validate output determinism before enabling shared reuse.
6. Define local and remote cache tiers and lookup/write policy.
7. Enforce authentication, authorization, integrity verification, and namespace isolation.
8. Instrument hit, miss, upload/download, eviction, and corruption metrics.
9. Compare transfer cost with recomputation cost.
10. Test invalidation by changing each material input class.

## Decision points
Do not remotely cache cheap actions whose transfer overhead dominates. Use read-only cache access for less-trusted consumers. Partition caches when platform or security boundaries cannot safely share artifacts.

## Common failure patterns
Missing flags in keys, environment leakage, caching nondeterministic outputs, oversized artifacts, unbounded retention, cache poisoning, and optimizing hit rate instead of end-to-end latency.

## Verification
Deliberately mutate source, flags, toolchain, environment, and platform inputs; verify required misses. Repeat unchanged builds for hits. Validate artifact hashes and benchmark cold/warm performance.

## Expected output
A cache-key specification, tiering and security policy, telemetry, and measured latency/cost impact.

## Stop conditions
Stop if action determinism is unproven, cache integrity cannot be enforced, or sensitive artifacts would cross an unauthorized trust boundary.