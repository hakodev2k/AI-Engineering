# Erasure Coding

## Purpose
Evaluate, design, and operate erasure-coded storage for high durability with lower storage overhead than full replication.

## When to use
Use for large, relatively cold or immutable datasets where storage efficiency matters and reconstruction cost is acceptable. Do not choose erasure coding solely to reduce raw capacity without modeling latency, repair bandwidth, and failure-domain behavior.

## Inputs
Dataset size, object size distribution, access frequency, durability target, failure domains, network bandwidth, CPU budget, latency goals, and cost model.

## Preconditions
Define the tolerated number and correlation of simultaneous failures and the expected time to repair.

## Context to inspect
Coding parameters, stripe layout, chunk placement, metadata, reconstruction path, degraded reads, repair scheduling, checksums, and lifecycle policies.

## Core knowledge
An erasure code divides data into data and parity fragments. Parameters determine storage overhead and the number of tolerable missing fragments. Durability depends on independent placement and timely repair, not code parameters alone. Small-object workloads can make encoding and metadata overhead disproportionate.

## Procedure
1. Define durability, availability, latency, and cost objectives.
2. Measure object sizes and access temperature.
3. Compare replication with candidate coding parameters.
4. Model simultaneous failure tolerance by failure domain.
5. Define stripe and fragment placement.
6. Quantify encode/decode CPU and network cost.
7. Design degraded-read behavior.
8. Define detection and prioritized reconstruction of missing fragments.
9. Reserve bandwidth and capacity for repair.
10. Protect fragment integrity with checksums.
11. Test reconstruction from each tolerated failure pattern.
12. Measure latency during degraded and repair states.

## Decision points
Prefer replication for hot, small, latency-sensitive data or when fast recovery dominates. Prefer erasure coding for large data where capacity efficiency materially outweighs reconstruction complexity.

## Common failure patterns
Fragments placed in correlated failure domains, slow repair, undersized recovery bandwidth, coding tiny objects inefficiently, missing integrity checks, and underestimating degraded-read latency.

## Verification
Validate code parameters mathematically, test reconstruction, measure repair completion time and degraded-read performance, and verify placement satisfies failure-domain constraints.

## Expected output
An erasure-coding design with parameters, placement, degraded-read semantics, repair policy, capacity economics, and operational limits.

## Stop conditions
Stop when recovery bandwidth or failure-domain diversity cannot support the claimed durability target.