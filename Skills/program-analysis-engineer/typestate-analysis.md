# Typestate Analysis

## Purpose
Verify that objects and resources are used only in valid states and legal operation sequences.

## When to use
Use for files, sockets, transactions, locks, streams, protocol sessions, builders, authentication states, and APIs with lifecycle constraints.

## Inputs
State machine, relevant API operations, CFG, alias/call information, ownership behavior, and error semantics.

## Preconditions
Define valid states, transitions, terminal states, and operations that transfer or invalidate ownership.

## Context to inspect
Constructors, factories, aliases, wrappers, cleanup paths, exceptions, callbacks, asynchronous operations, and resource escape.

## Core knowledge
Typestate combines state-machine reasoning with flow and alias information. Strong updates are possible only when the analysis knows the target object precisely; merged aliases often require conservative weak updates.

## Procedure
1. Specify abstract resource states.
2. Map API operations to transitions.
3. Define invalid transitions and required terminal conditions.
4. Track resource identities through assignments and calls.
5. Propagate states over the CFG.
6. Merge states conservatively at joins.
7. Model ownership transfer and escape.
8. Handle exceptional cleanup paths.
9. Report violations with transition history.
10. Add protocol-specific regression cases.

## Decision points
Use object-sensitive tracking when identities matter; collapse states for scale only if the resulting precision remains actionable.

## Common failure patterns
Ignoring exceptional exits, losing identity through wrappers, assuming cleanup always executes, treating may-state as must-state, and failing to model ownership transfer.

## Verification
Test valid/invalid sequences, aliasing, exceptions, early returns, and interprocedural resource handoff.

## Expected output
Actionable lifecycle violations with resource identity, state history, and confidence.

## Stop conditions
Stop when the API lifecycle is ambiguous or alias precision cannot support the intended correctness claim.