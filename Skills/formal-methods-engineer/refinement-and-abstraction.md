# Refinement and Abstraction

## Purpose
Relate high-level specifications to progressively more concrete designs while preserving required properties and controlling verification complexity.

## When to use
Use when moving from abstract protocols or state machines toward implementable algorithms, data structures, or distributed components. Use abstraction when concrete state spaces are too large for useful verification.

## Inputs
Abstract specification, concrete design, invariants, refinement relation, implementation constraints, and verification goals.

## Preconditions
Both abstraction levels must have clear state and behavioral semantics.

## Context to inspect
Representation changes, hidden/internal actions, stuttering behavior, data encodings, concurrency, error handling, and nondeterminism introduced or removed by refinement.

## Core knowledge
A refinement argument explains why every relevant concrete behavior is allowed by the abstract specification. Abstraction must preserve the class of properties being checked; overly aggressive abstraction can introduce false positives or conceal real failures.

## Procedure
1. Identify the properties that must survive refinement.
2. Define abstract and concrete state spaces.
3. Specify the abstraction/refinement mapping.
4. Map initial states.
5. Map concrete transitions to abstract transitions or justified stuttering.
6. Prove or check invariant preservation across the mapping.
7. Analyze newly introduced failure and concurrency behavior.
8. Validate that hidden actions do not break liveness assumptions.
9. Use small examples to test the mapping in both directions where relevant.
10. Document behavior intentionally left unspecified at the abstract level.

## Decision points
Use data abstraction when values are irrelevant to control behavior; use compositional abstraction when component interaction dominates. Strengthen the abstract model only when requirements justify it, not merely to simplify proof.

## Common failure patterns
Unstated refinement mappings, ignoring stuttering, losing error behavior, assuming implementation determinism is required, and using an abstraction that does not preserve the target property.

## Verification
Check representative traces, prove simulation/refinement obligations, and ensure counterexamples at the concrete level can be interpreted at the abstract level.

## Expected output
A refinement relation, proof obligations, verified mappings, and documented abstraction limits.

## Stop conditions
Stop when the relation cannot represent legitimate concrete behavior, hidden actions invalidate liveness reasoning, or abstraction makes the verification claim unsound.