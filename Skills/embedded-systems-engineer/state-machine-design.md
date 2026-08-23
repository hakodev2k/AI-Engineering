# State Machine Design

## Purpose
Model complex device behavior explicitly so transitions, timeouts, errors, recovery, and concurrency remain reviewable and testable.

## When to use
Use for protocol sessions, device modes, power sequences, actuator control, boot/update flows, and logic dominated by flags and nested conditions.

## Inputs
Behavioral requirements, events, states, timing rules, failure modes, existing code, and safety constraints.

## Context to inspect
Inspect flags, timers, event sources, reentrancy, transition side effects, persisted state, reset behavior, and error recovery.

## Core knowledge
A useful state machine makes legal states and transitions explicit. Events should be processed deterministically; entry/exit actions and guards need clear ownership. Hierarchical states can reduce duplication but add conceptual cost.

## Procedure
1. Define observable modes and invariants.
2. Enumerate events including timeout/error/reset.
3. Define legal transitions and guards.
4. Separate transition decisions from side effects where practical.
5. Define entry/exit actions and timer ownership.
6. Specify behavior for unexpected events.
7. Test every critical transition and recovery path.
8. Instrument state transitions for diagnosis with bounded overhead.

## Decision points
Use table-driven machines for many regular transitions; explicit switch/state patterns for simpler flows; hierarchical models when shared substates materially reduce complexity.

## Common failure patterns
Boolean flag combinations acting as hidden states, transitions from multiple contexts, forgotten timeout cancellation, recursive event handling, implicit default transitions, and no recovery state.

## Verification
Generate transition-focused tests, fuzz event ordering where useful, verify invariants, and inspect traces from normal and fault scenarios.

## Expected output
An explicit state/event/transition model with deterministic actions, error handling, and regression tests.

## Stop conditions
Stop when behavior requirements conflict or safety-critical transitions lack an authorized specification.