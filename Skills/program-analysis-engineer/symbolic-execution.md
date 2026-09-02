# Symbolic Execution

## Purpose
Explore program paths using symbolic inputs and path constraints to discover bugs, prove bounded properties, or generate high-value test cases.

## When to use
Use for assertion violations, boundary bugs, parser validation, security checks, protocol/state exploration, and targeted path reasoning.

## Inputs
IR or executable semantics, target functions, symbolic inputs, solver, environment models, and resource limits.

## Preconditions
Define the bounded scope and identify external effects that require modeling.

## Context to inspect
Branches, loops, calls, heap operations, exceptions, native code, nondeterminism, and solver-supported theories.

## Core knowledge
Path explosion is fundamental. State merging, search heuristics, summaries, loop bounds, and concolic execution trade completeness for tractability. Solver queries must encode language semantics accurately.

## Procedure
1. Define target property and symbolic inputs.
2. Build symbolic semantics for relevant operations.
3. Collect path constraints at branches.
4. Query satisfiability before expanding expensive paths.
5. Bound loops, recursion, and environment behavior deliberately.
6. Prioritize paths using coverage or risk heuristics.
7. Model libraries with summaries when appropriate.
8. Extract concrete counterexample inputs from satisfiable violations.
9. Minimize counterexamples when possible.
10. Record incomplete exploration explicitly.

## Decision points
Use pure symbolic execution for focused bounded regions; use concolic execution when concrete execution can cheaply provide environment behavior. Merge states only when solver complexity remains manageable.

## Common failure patterns
Silent loop truncation, inaccurate integer/overflow semantics, unsound external-call models, solver timeouts treated as unsat, and claiming proof from incomplete path exploration.

## Verification
Replay generated inputs concretely, verify solver constraints, and regression-test known path-explosion and semantic edge cases.

## Expected output
Reproducible counterexamples or bounded verification evidence with coverage and limitations.

## Stop conditions
Stop when unsupported semantics dominate, solver uncertainty prevents a defensible conclusion, or resource limits invalidate the intended coverage claim.