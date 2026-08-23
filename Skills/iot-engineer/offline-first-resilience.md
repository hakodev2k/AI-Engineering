# Offline-First Resilience

## Purpose
Keep devices useful and recoverable during intermittent or prolonged connectivity loss.

## When to use
Use whenever connectivity cannot be guaranteed or local operation has business/safety value.

## Inputs
Offline requirements, command semantics, local storage, reconnect behavior, consistency needs.

## Context to inspect
Queues, caches, clocks, local rules, cloud state, storage limits, and synchronization logic.

## Core knowledge
Offline-first design requires explicit authority, bounded buffering, replay semantics, idempotency, conflict policy, and stale-data handling.

## Procedure
1. Define which functions must operate offline.
2. Classify local versus cloud-authoritative state.
3. Buffer outbound data with bounded durable storage.
4. Assign stable IDs and timestamps/sequence information.
5. Define expiration and priority.
6. Make replay consumers idempotent.
7. Define conflict resolution for divergent state.
8. Recover gradually after reconnect to avoid storms.
9. Test long outages and storage exhaustion.

## Decision points
Drop low-value telemetry before critical events when storage is constrained. Use deterministic conflict rules where possible; require human resolution for high-impact ambiguity.

## Common failure patterns
Unbounded queues, replay duplicates, stale commands, clock assumptions, reconnect floods, and silent data loss.

## Verification
Simulate outages from minutes to expected worst case, power cycles while offline, full buffers, duplicate replay, and clock drift.

## Expected output
A tested degraded-mode and synchronization strategy.

## Stop conditions
Escalate when offline behavior could cause unsafe physical actions or irreversible conflicting state.