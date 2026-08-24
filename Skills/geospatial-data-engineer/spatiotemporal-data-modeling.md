# Spatiotemporal Data Modeling

## Purpose
Model changing locations, trajectories, and time-valid spatial features without losing event order, history, or spatial semantics.

## When to use
Use for moving assets, telemetry, changing boundaries, historical maps, or time-aware spatial analytics.

## Inputs
Event streams or snapshots, timestamps, identifiers, geometry, temporal precision, retention and query requirements.

## Context to inspect
Inspect clock sources, timezone handling, event ordering, update frequency, late arrivals, identity stability, and existing history policy.

## Core knowledge
Spatiotemporal systems must distinguish event time from processing time, snapshots from intervals, and observations from inferred trajectories. Late and duplicated events are normal production conditions.

## Procedure
1. Define entity identity and temporal semantics.
2. Preserve event time and ingestion time separately.
3. Choose point observations, validity intervals, snapshots, or trajectory segments.
4. Establish ordering and deduplication rules.
5. Define late-arrival and correction behavior.
6. Partition by time and/or space based on access patterns.
7. Preserve original observations before deriving trajectories.
8. Add spatial and temporal indexes appropriate to queries.
9. Test gaps, overlaps, clock skew, and out-of-order events.
10. Document retention, compaction, and backfill rules.

## Decision points
Use immutable events when auditability matters; use current-state tables for fast operational reads but derive them from history where possible.

## Common failure patterns
Using processing time as truth, overwriting history, ambiguous interval boundaries, duplicate telemetry, and reconstructing trajectories from unordered samples.

## Verification
Verify temporal ordering, interval consistency, deduplication, representative trajectory queries, and backfill behavior.

## Expected output
A spatiotemporal schema with explicit event-time semantics and validated history handling.

## Stop conditions
Stop when timestamp provenance is unreliable, entity identity is unstable, or required history cannot be retained.