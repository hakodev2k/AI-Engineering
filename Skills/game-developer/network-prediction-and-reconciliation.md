# Network Prediction and Reconciliation

## Purpose
Hide network latency for player-controlled simulation while preserving server authority and converging clients toward authoritative state.

## When to use
Use for responsive multiplayer movement, vehicles, abilities, projectiles, or visible correction/jitter problems.

## Inputs
Authority model, input commands, simulation rules, tick rate, latency targets, deterministic constraints, and transport semantics.

## Context to inspect
Inspect command sequencing, state snapshots, local history buffers, correction thresholds, physics behavior, and interpolation of remote entities.

## Core knowledge
Prediction re-simulates local commands before server confirmation. Reconciliation replaces or corrects predicted state using authoritative snapshots then reapplies unacknowledged commands. Determinism and bounded history are key constraints.

## Procedure
1. Identify latency-sensitive locally controlled state.
2. Define compact sequenced input commands.
3. Simulate commands locally and server-side under compatible rules.
4. Buffer recent commands and predicted states.
5. Include acknowledgement state in server snapshots.
6. On mismatch, restore authoritative state and replay pending commands.
7. Smooth presentation corrections without corrupting simulation truth.
8. Define teleport/large-error thresholds.
9. Measure correction frequency and magnitude under network impairment.

## Decision points
Predict only mechanics whose local simulation can be reproduced sufficiently. Use visual smoothing for small corrections and hard snaps for errors where smoothing would violate gameplay. Avoid prediction for hidden or server-only outcomes.

## Common failure patterns
Predicting random outcomes without synchronized seeds, mixing render and simulation transforms, unbounded history, replaying side effects twice, and hiding severe divergence with excessive smoothing.

## Verification
Test latency, jitter, loss, reordering, variable frame rate, collision-heavy scenarios, and command side effects. Track correction metrics.

## Expected output
Responsive local control that converges reliably to authoritative server state.

## Stop conditions
Stop when server and client simulation cannot be made sufficiently compatible or authority requirements prohibit local prediction.