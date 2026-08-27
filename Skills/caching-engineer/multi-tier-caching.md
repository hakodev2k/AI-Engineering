# Multi-Tier Caching

## Purpose
Design L1/L2/edge cache hierarchies that improve locality while controlling coherence and operational complexity.

## When to use
Use when one cache tier cannot meet latency, geographic, cost, or origin-protection goals.

## Inputs
Latency budget, topology, data mutability, reuse locality, invalidation mechanisms.

## Context to inspect
Inspect all existing tiers, TTLs, routing, purge flows, request headers, local memory limits, and consistency requirements.

## Core knowledge
Each tier changes hit probability and stale-state propagation. L1 local caches reduce network latency but duplicate memory and invalidate poorly; L2 shared caches improve reuse; edge caches reduce geographic RTT. Effective TTL and invalidation behavior must be reasoned across all layers.

## Procedure
1. Measure which latency component each proposed tier removes.
2. Define authority and population flow per tier.
3. Set tier-specific TTLs from a single freshness contract.
4. Define invalidation propagation order.
5. Prevent lower-tier stale values from repopulating newer upper-tier state.
6. Bound local memory and cardinality.
7. Instrument hits by tier.
8. Test rolling deploy, purge, cache loss, and stale propagation.
9. Compare complexity against measured latency benefit.

## Decision points
Add L1 when network/cache RTT is material and staleness is tolerable. Add edge caching for geographically reusable representations. Avoid layers that merely duplicate storage without measurable benefit.

## Common failure patterns
Independent TTL policies; incomplete purge; local caches surviving authorization changes; no per-tier hit telemetry; stale L2 refilling L1.

## Verification
Trace representative requests and prove freshness and latency objectives across all tiers.

## Expected output
A coherent tier topology with per-tier responsibilities and verified behavior.

## Stop conditions
Stop if invalidation cannot cross tiers within the required freshness window.