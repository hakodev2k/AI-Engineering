# Cloud-Edge Partitioning

## Purpose
Decide which AI and data-processing responsibilities belong on device, at a gateway, or in cloud services, with explicit semantics for latency, privacy, bandwidth, consistency, and offline operation.

## When to use
Use when moving workloads between cloud and device, designing hybrid inference, adding remote fallback, or reducing bandwidth and privacy exposure.

## Inputs
Latency requirements, connectivity profile, device capability, cloud capability, data sensitivity, fleet scale, model sizes, synchronization needs, and operating cost constraints.

## Preconditions
Classify which user-critical functions must continue without network access.

## Context to inspect
Current API calls, local caches, data upload, remote feature stores, model routing, authentication, retry logic, version negotiation, and cloud dependency chains.

## Core knowledge
Partitioning creates distributed-system problems: stale state, duplicate work, retries, version skew, network partitions, and partial failure. Cloud fallback can improve quality but can also create unpredictable latency and privacy changes. Device decisions should remain deterministic when connectivity disappears if offline operation is a requirement.

## Procedure
1. Decompose the workload into sensing, feature extraction, inference, aggregation, decision, storage, and learning feedback.
2. Assign latency and privacy constraints to each stage.
3. Measure expected network latency, bandwidth, outage duration, and cost.
4. Determine which data may legally and operationally leave the device.
5. Place deadline-critical or privacy-sensitive stages locally when feasible.
6. Define cloud augmentation/fallback with explicit timeout and cancellation behavior.
7. Define state synchronization, idempotency, and version compatibility.
8. Bound retries and local buffering during outages.
9. Define behavior when device and cloud model versions differ.
10. Test network loss, high latency, duplicate responses, and recovery.
11. Measure end-to-end quality/cost trade-offs for the final partition.

## Decision points
Use local inference when latency/offline/privacy dominate; cloud inference when global context or compute dominates; hybrid routing only when added operational complexity is justified by measurable value.

## Common failure patterns
Infinite retry queues, hidden dependence on cloud metadata, inconsistent local/cloud preprocessing, stale remote responses applied after newer local decisions, and privacy scope silently changing during fallback.

## Verification
Run offline, degraded-network, and reconnect scenarios; verify bounded storage, request idempotency, timeout behavior, version compatibility, and data-governance rules.

## Expected output
A partitioned architecture with explicit ownership, failure semantics, synchronization rules, and measured trade-offs.

## Stop conditions
Stop when offline requirements, data-transfer permissions, or consistency semantics are unresolved.