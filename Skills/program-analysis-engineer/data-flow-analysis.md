# Data Flow Analysis

## Purpose
Implement forward or backward analyses that compute facts over program points using explicit transfer functions and convergence rules.

## When to use
Use for reaching definitions, liveness, constant propagation, definite assignment, nullability, available expressions, and many security analyses.

## Inputs
CFG, analysis domain, transfer semantics, join behavior, and precision/performance goals.

## Preconditions
The CFG and language semantics must be sufficiently accurate for the target property.

## Context to inspect
Basic blocks, variable identities, aliasing, calls, exceptions, loops, and existing analysis framework behavior.

## Core knowledge
Classical data-flow analysis relies on a lattice, monotone transfer functions, fixed-point iteration, and merge operations. Precision depends on domain design and modeling of kills, gens, aliases, and calls.

## Procedure
1. Define the fact domain and ordering.
2. Choose forward or backward direction.
3. Define entry/boundary facts.
4. Implement transfer functions per relevant operation.
5. Define join or meet at merge points.
6. Select worklist ordering and convergence strategy.
7. Model loops and calls conservatively.
8. Add widening only when required for termination.
9. Record provenance for user-visible facts.
10. Benchmark memory and iterations.

## Decision points
Choose richer domains only when they materially reduce false findings. Prefer sparse representations when facts attach naturally to SSA values or definitions.

## Common failure patterns
Non-monotone transfers, incorrect boundary facts, hidden aliasing assumptions, stale cached facts, and widening that destroys useful precision.

## Verification
Use hand-computed examples, loop-heavy cases, mutation tests, and differential checks against simpler conservative analyses.

## Expected output
A convergent data-flow analysis with tested transfer semantics and documented precision assumptions.

## Stop conditions
Stop when the abstract domain cannot represent required semantics or termination cannot be guaranteed within resource limits.