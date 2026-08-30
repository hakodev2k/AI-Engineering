# State Machine Modeling

## Purpose
Model system behavior as explicit states and transitions so concurrency, failure, protocol, and lifecycle behavior can be analyzed systematically.

## When to use
Use for workflows, protocols, distributed coordination, lifecycle logic, controllers, and systems where order matters. Avoid forcing purely functional calculations into a state-machine model without benefit.

## Inputs
Requirements, events, commands, current lifecycle states, error conditions, timers, retries, and external interactions.

## Preconditions
Events and externally visible behaviors must be identifiable.

## Context to inspect
Existing enums, workflow code, queues, timers, persistence, idempotency rules, timeout behavior, and recovery paths.

## Core knowledge
State machines require explicit initialization, enabled transitions, guards, effects, and failure behavior. State explosion grows rapidly with concurrency and orthogonal dimensions, so abstraction and decomposition are Senior-level design choices.

## Procedure
1. Define the modeling boundary and observables.
2. Identify minimal state needed to predict relevant behavior.
3. Define initial and terminal states where applicable.
4. Enumerate events and transition guards.
5. Specify transition effects and emitted outputs.
6. Add timeout, cancellation, retry, crash, and duplicate-event transitions.
7. Represent concurrency explicitly rather than assuming serialization.
8. Check unreachable, dead, and ambiguous states.
9. Decompose orthogonal concerns when the product state grows excessively.
10. Assert safety and progress properties over the model.
11. Compare traces against representative production scenarios.

## Decision points
Use hierarchical state machines for nested lifecycle semantics; use communicating machines when component interaction is the verification target. Abstract data values when exact values are irrelevant to control flow.

## Common failure patterns
Implicit states hidden in flags, missing error transitions, overlapping guards, impossible terminal recovery, assumed event ordering, and uncontrolled state explosion.

## Verification
Enumerate or model-check reachable states, test transition determinism where required, inspect counterexample traces, and compare model traces with implementation logs or tests.

## Expected output
A state-machine model with defined states, events, guards, effects, properties, and documented abstractions.

## Stop conditions
Stop when required event ordering is unknown, hidden state materially affects behavior, or abstraction removes the property being verified.