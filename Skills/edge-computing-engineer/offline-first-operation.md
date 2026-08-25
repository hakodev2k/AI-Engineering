# Offline-First Operation

## Purpose
Design edge workloads that continue useful operation during unreliable or absent upstream connectivity.

## When to use
Use for field, industrial, retail, vehicle, remote-site, or mobile edge workloads where cloud reachability cannot be assumed.

## Inputs
- Critical user or machine workflows
- Connectivity loss patterns
- Local storage limits
- Recovery objectives
- Synchronization requirements

## Context to inspect
Inspect current cloud calls, local dependencies, credentials, caches, queues, persistent state, and failure behavior.

## Core knowledge
Offline-first systems separate local correctness from eventual upstream synchronization. They require explicit degraded modes, bounded queues, durable local state, conflict handling, and expiration rules.

## Procedure
1. Identify operations that must remain available offline.
2. Remove hidden synchronous cloud dependencies from those paths.
3. Define locally authoritative state and cached reference data.
4. Persist pending outbound work durably.
5. Define queue bounds, retention, and backpressure.
6. Define user-visible or machine-visible degraded behavior.
7. Define reconnection detection and replay ordering.
8. Make retries idempotent.
9. Resolve or surface conflicts explicitly.
10. Test long-duration disconnection and recovery.

## Decision points
Use local authority when immediate decisions matter more than global freshness. Use read-only degraded mode when writes cannot be reconciled safely.

## Common failure patterns
- Assuming short outages only
- Unbounded local queues
- Lost writes after restart
- Duplicate replay
- Silent stale-data use

## Verification
Disconnect upstream networks in test environments, restart processes while offline, accumulate queued work, reconnect, and verify no loss, duplication, or invalid conflict resolution.

## Expected output
A documented offline operating mode with persistence, replay, reconciliation, and degraded-service rules.

## Stop conditions
Stop if business rules cannot define safe behavior for conflicting offline writes or required local persistence is unavailable.