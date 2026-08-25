# Gameplay State Rules

## Purpose
Preserve coherent, inspectable gameplay state under normal, interrupted, and edge-case execution.

## Scope
State machines, entity state, transitions, lifecycle, pause, death, respawn, and scene changes.

## MUST
- State transitions MUST have explicit valid preconditions and postconditions.
- Critical state changes MUST have a single authoritative owner.
- Invalid or impossible states MUST fail visibly in development and be diagnosable in production builds.
- Lifecycle cleanup MUST release subscriptions, handles, and transient ownership.

## MUST NOT
- MUST NOT encode mutually exclusive states as unrelated booleans when invalid combinations can occur.
- MUST NOT allow hidden update-order dependencies to define gameplay correctness.

## SHOULD
- Complex behavior SHOULD use explicit state machines or equivalent constrained models.
- State transitions SHOULD be observable in debugging tooling.

## Exceptions
Simpler representations are acceptable when the valid state space is demonstrably small and invariant checks prevent ambiguity.

## Verification
Use transition tests, invariant assertions, lifecycle tests, debug traces, and review of ownership boundaries.