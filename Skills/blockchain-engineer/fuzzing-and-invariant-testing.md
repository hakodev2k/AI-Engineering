# Fuzzing and Invariant Testing

## Purpose
Discover state-machine and arithmetic defects by exploring broad input ranges and action sequences against explicit protocol invariants.

## When to use
Use for asset protocols, complex state transitions, pricing/accounting logic, authorization flows, and audit preparation.

## Inputs
Invariant list, callable actions, valid input domains, protocol state model, testing framework.

## Preconditions
Critical properties are stated independently from implementation details.

## Context to inspect
Existing tests, handlers, assumptions, bound functions, ghost variables, actor models, and unreachable states.

## Core knowledge
Useful fuzzing requires meaningful generators and assertions. Stateful invariant testing models sequences of calls by multiple actors and is especially effective for conservation, solvency, ownership, and access-control properties.

## Procedure
1. Define invariants such as conservation, solvency, monotonicity, or authorization.
2. Identify state-changing actions and actor classes.
3. Build handlers that generate valid and strategically invalid operations.
4. Bound values to realistic but adversarial ranges.
5. Add ghost accounting when implementation state alone cannot express the property.
6. Include privileged, unprivileged, and malicious actors.
7. Increase sequence length and run count after harness stabilization.
8. Minimize and preserve failing seeds.
9. Convert every confirmed defect into a permanent regression case.

## Decision points
Use stateless fuzzing for pure calculations and input validation; use stateful invariants when failure depends on call ordering or accumulated state.

## Common failure patterns
Tautological invariants, generators that never reach dangerous states, excessive assumptions that filter failures, and checking implementation against itself.

## Verification
Demonstrate that mutation of a protected property causes the harness to fail and that failures reproduce from captured seeds.

## Expected output
Reusable fuzz/invariant harness, documented properties, failure corpus, and regression tests.

## Stop conditions
Stop when the harness cannot model critical actors or dependencies without invalidating the tested property.