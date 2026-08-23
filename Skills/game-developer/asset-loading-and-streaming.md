# Asset Loading and Streaming

## Purpose
Load and unload game content predictably without frame stalls, excessive memory residency, broken references, or platform-specific I/O failures.

## When to use
Use for large worlds, scene transitions, downloadable content, addressable bundles, async loading, texture/audio streaming, or loading hitches.

## Inputs
Asset catalog, dependency graph, memory budget, storage bandwidth, loading UX requirements, packaging strategy, and platform APIs.

## Context to inspect
Inspect synchronous loads, asset dependencies, bundle/package boundaries, preload lists, caches, unload rules, scene ownership, and content versioning.

## Core knowledge
Loading is a pipeline across storage, decompression, deserialization, GPU upload, and initialization. Async APIs do not guarantee zero main-thread work. Packaging decisions influence patch size, duplication, and dependency lifetime.

## Procedure
1. Define loading moments and latency budgets.
2. Inventory large/high-frequency assets and dependencies.
3. Remove accidental synchronous loads from gameplay paths.
4. Group content according to lifecycle and patching needs.
5. Preload only predictable near-term dependencies.
6. Stream content incrementally under memory budgets.
7. Define ownership and unload conditions.
8. Handle missing/corrupt/version-mismatched content.
9. Profile I/O, decompression, initialization, and GPU upload separately.
10. Test cold storage and constrained devices.

## Decision points
Preload small critical assets when latency matters; stream large or optional content. Bundle assets sharing lifecycle while avoiding duplication and oversized patch units.

## Common failure patterns
Async calls followed by immediate blocking waits, asset reference leaks, huge monolithic bundles, duplicated dependencies, no cancellation, and measuring only warm caches.

## Verification
Measure cold/warm load times, frame spikes, peak memory, unload behavior, patch/package sizes, and failure recovery.

## Expected output
A lifecycle-aware asset pipeline meeting load-time and memory budgets.

## Stop conditions
Stop when content packaging constraints, platform storage behavior, or ownership of shared assets is unresolved.