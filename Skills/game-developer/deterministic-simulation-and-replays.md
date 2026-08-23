# Deterministic Simulation and Replays

## Purpose
Build reproducible simulation and replay capabilities for debugging, networking, testing, competitive validation, or player replay features.

## When to use
Use for lockstep networking, authoritative replays, deterministic tests, desync investigation, rollback systems, or reproducible gameplay sessions.

## Inputs
Simulation rules, tick model, random-number usage, physics dependencies, input stream, platform targets, and replay requirements.

## Context to inspect
Inspect floating-point operations, random generators, unordered collections, time sources, physics, asynchronous events, and hidden external state.

## Core knowledge
Determinism means identical initial state plus identical ordered inputs produce equivalent simulation state. Floating-point behavior, iteration order, random seeds, and external timing can break this. Full determinism may be expensive or impossible with some engine physics.

## Procedure
1. Define the exact deterministic boundary.
2. Use a fixed simulation tick.
3. Route simulation randomness through controlled seeded generators.
4. Remove wall-clock and render-frame dependencies.
5. Stabilize iteration and event ordering.
6. Record compact ordered inputs and required initial state.
7. Compute periodic state hashes for divergence detection.
8. Build replay tooling with seek/checkpoint support if needed.
9. Run cross-platform determinism tests where required.
10. Diagnose first divergent tick rather than final mismatch.

## Decision points
Pursue strict determinism only when networking/replay requirements justify it. Otherwise record authoritative state snapshots. Use fixed-point or constrained math when floating-point divergence is unacceptable.

## Common failure patterns
Global random calls, relying on dictionary order, frame-time inputs, non-deterministic physics, replaying audiovisual side effects as simulation state, and comparing only end results.

## Verification
Replay identical inputs repeatedly, compare state hashes, test across target platforms, and inject known divergence to validate diagnostics.

## Expected output
A defined deterministic simulation boundary and reproducible replay/desync evidence.

## Stop conditions
Stop when required third-party simulation cannot guarantee acceptable determinism and no snapshot-based alternative is approved.