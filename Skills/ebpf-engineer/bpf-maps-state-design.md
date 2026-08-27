# BPF Maps and State Design

## Purpose
Design bounded, concurrency-aware kernel/user-space state using appropriate BPF map types.

## When to use
Use for counters, correlation, policy state, caches, histograms, connection tracking, or configuration.

## Inputs
State semantics, key cardinality, update/read patterns, CPU topology, memory budget, persistence requirements.

## Context to inspect
Inspect map type support, pinning, ownership, update contention, eviction needs, key/value ABI, and cleanup paths.

## Core knowledge
Map choice changes concurrency, memory, lookup cost, eviction, and lifecycle. Per-CPU maps reduce contention but require aggregation. LRU bounds cardinality but eviction changes semantics.

## Procedure
1. Define state ownership and consistency requirements.
2. Estimate worst-case cardinality and memory.
3. Select map type based on access pattern, not familiarity.
4. Define stable key/value layouts and versioning.
5. Design atomicity, locking, or per-CPU strategy.
6. Define insertion, expiry, eviction, and cleanup.
7. Decide pinning and restart semantics.
8. Instrument utilization, update failures, and eviction.
9. Stress concurrent access and cardinality limits.

## Decision points
Choose per-CPU for hot independent counters; hash maps for keyed state; LRU only when eviction is acceptable; arrays for dense bounded indices. Pin only when cross-process/restart persistence is required.

## Common failure patterns
Unbounded keys, accidental padding ABI issues, leaked pinned maps, contention hotspots, silent LRU semantic loss, and no capacity monitoring.

## Verification
Measure memory, contention, eviction behavior, restart lifecycle, concurrent correctness, and user-space decoding.

## Expected output
A bounded map design with explicit lifecycle, concurrency, and capacity behavior.

## Stop conditions
Stop if required consistency cannot be provided by available map semantics or memory bounds cannot be established.