# CQRS Projections

## Purpose
Build query models derived from event streams while making staleness and rebuild behavior explicit.

## When to use
Use when read models differ materially from write models or consumers need denormalized event-driven views.

## Inputs
Query use cases, source events, freshness SLO, projection store, rebuild volume.

## Context to inspect
Event retention, consumer checkpoints, schema versions, query indexes, consistency expectations, and backfill tooling.

## Core knowledge
CQRS separates write and read models; it does not require event sourcing. Projections should be deterministic, idempotent, observable, and rebuildable where feasible.

## Procedure
1. Start from concrete query requirements.
2. Define projection schema optimized for those reads.
3. Map authoritative source events to state transitions.
4. Track consumer position/checkpoint durably.
5. Make handlers idempotent and ordering-aware.
6. Expose freshness/lag where users depend on recency.
7. Define rebuild into a shadow store or versioned projection.
8. Validate before atomic cutover.
9. Monitor lag, failures, and divergence.

## Decision points
Use direct synchronous reads when strong freshness is required and scale permits. Use projections for high-volume, cross-entity, or specialized read patterns where eventual consistency is acceptable.

## Common failure patterns
Treating projection as authoritative write state, hidden staleness, non-repeatable rebuilds, destructive in-place rebuild, and missing indexes.

## Verification
Replay produces the same logical projection; query acceptance tests pass; lag remains inside SLO under peak and recovery loads.

## Expected output
A deterministic projection design with freshness, checkpoint, rebuild, and cutover procedures.

## Stop conditions
Stop if source history is insufficient for rebuild or required consistency cannot tolerate projection lag.