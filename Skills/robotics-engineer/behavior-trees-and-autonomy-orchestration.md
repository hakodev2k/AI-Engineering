# Behavior Trees and Autonomy Orchestration

## Purpose
Structure robot autonomy into explicit, testable behaviors with bounded recovery, cancellation, and fallback semantics.

## When to use
Use for mission sequencing, task execution, recovery logic, operator handoff, or when monolithic state logic becomes hard to reason about.

## Inputs
Mission states, actions, preconditions, success/failure criteria, recovery behaviors, safety constraints, operator commands.

## Preconditions
Leaf actions expose clear status, cancellation, timeout, and error semantics.

## Context to inspect
Current state machine or behavior tree, action APIs, blackboard/shared state, retry rules, safety interlocks, mode management.

## Core knowledge
Behavior trees, hierarchical state machines, and task planners each encode control flow differently. Senior designs separate decision logic from low-level control and make recovery finite and observable.

## Procedure
1. Enumerate mission goals and terminal outcomes.
2. Decompose work into bounded leaf behaviors.
3. Define preconditions and postconditions for each leaf.
4. Model success, failure, timeout, cancellation, and interruption.
5. Add retries only for transient, bounded failures.
6. Define fallback and safe-stop behavior.
7. Prevent concurrent behaviors from commanding the same resource without arbitration.
8. Instrument transitions and reasons.
9. Test nominal, interrupted, partial-failure, and operator-override scenarios.
10. Review tree/state complexity and remove hidden side effects.

## Decision points
Use behavior trees for reactive hierarchical orchestration, state machines for explicit finite modes, and planners when dynamic goal decomposition materially helps.

## Common failure patterns
Infinite retries, side effects in conditions, hidden shared state, uncancellable actions, multiple owners of actuators, and recovery that restarts dangerous work blindly.

## Verification
Run deterministic scenario tests covering every terminal path, cancellation, timeout, and recovery transition; verify actuator ownership and safe-stop behavior.

## Expected output
Autonomy graph/tree, leaf contracts, retry/fallback policy, transition telemetry, and scenario-test evidence.

## Stop conditions
Stop when safety ownership is ambiguous, actions cannot be cancelled safely, or recovery depends on unknown physical state.