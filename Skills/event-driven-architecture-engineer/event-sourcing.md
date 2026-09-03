# Event Sourcing

## Purpose
Design systems where authoritative state is reconstructed from an append-only sequence of domain events.

## When to use
Use when auditability, temporal reasoning, complex domain transitions, or state reconstruction justify added complexity. Do not adopt it as a default event-driven pattern.

## Inputs
Domain model, invariants, event history requirements, expected stream size, consistency and query needs.

## Context to inspect
Aggregate boundaries, storage guarantees, snapshots, projections, schema evolution, retention, and operational expertise.

## Core knowledge
Event sourcing makes events the source of truth, unlike ordinary integration events. Aggregate decisions depend on prior stream state and expected version. Projections are derived and rebuildable.

## Procedure
1. Confirm business value exceeds operational cost.
2. Define aggregate and stream identity.
3. Model domain events as durable historical facts.
4. Enforce optimistic concurrency with expected stream version.
5. Rehydrate state deterministically.
6. Separate integration events from internal domain history when appropriate.
7. Design projections and rebuild procedures.
8. Add snapshots only after measuring rehydration cost.
9. Define event upcasting/evolution policy.
10. Test replay from genesis and concurrent writes.

## Decision points
Prefer conventional state storage plus integration events when history is not authoritative. Snapshot only when measured stream length creates material latency.

## Common failure patterns
Deleting history, editing past events, using event sourcing for CRUD, leaking internal events externally, nondeterministic replay, and no projection rebuild plan.

## Verification
Full replay reproduces current state and projections; concurrency conflicts are detected; historical versions remain readable.

## Expected output
A justified event-sourced model with stream, projection, evolution, and recovery design.

## Stop conditions
Stop if immutable history conflicts with data-erasure obligations without an approved design, or domain boundaries are unstable.