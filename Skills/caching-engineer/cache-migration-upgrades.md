# Cache Migration and Upgrades

## Purpose
Migrate cache products, clusters, versions, key schemas, or serialization formats without uncontrolled cold starts or correctness regressions.

## When to use
Use for engine upgrades, topology changes, provider migration, or incompatible cache contract changes.

## Inputs
Current/target topology, key/value contracts, traffic, compatibility matrix, rollback requirements.

## Context to inspect
Inspect client versions, protocol compatibility, persistence/replication settings, TTL distribution, capacity, network paths, and deployment sequencing.

## Core knowledge
Caches are disposable in principle but abrupt loss of warm state can overload origins. Safe migration uses compatibility analysis, shadowing, dual-read/write only when justified, progressive traffic shifting, prewarming where valuable, and explicit rollback.

## Procedure
1. Define migration success and rollback criteria.
2. Inventory protocol, command, serialization, and key compatibility.
3. Benchmark target behavior.
4. Provision target with production-equivalent security and observability.
5. Decide whether to start cold, prewarm, or copy safe entries.
6. If dual operations are used, define conflict and failure semantics.
7. Shift a small traffic slice.
8. Compare hit ratio, latency, errors, memory, and origin load.
9. Increase traffic progressively while retaining rollback.
10. Remove compatibility paths only after stabilization.

## Decision points
Cold migration is simplest when origin can absorb warm-up. Prewarm hot data when cold misses are dangerous. Avoid dual-write complexity unless migration risk justifies it.

## Common failure patterns
Big-bang cutover; copying incompatible serialized values; no origin capacity check; rollback client incompatible with new keys; disabling old cluster too early.

## Verification
Complete progressive cutover tests and a rollback rehearsal; verify target SLO and origin headroom.

## Expected output
A staged migration with objective gates and rollback path.

## Stop conditions
Stop if rollback is impossible before risk acceptance or target compatibility is unverified.