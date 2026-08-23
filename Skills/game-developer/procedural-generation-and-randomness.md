# Procedural Generation and Randomness

## Purpose
Design reproducible, constrained procedural systems that create useful variation without invalid levels, unfair outcomes, or impossible-to-debug randomness.

## When to use
Use for maps, encounters, loot, spawning, terrain, roguelike content, randomized AI choices, or seeded test scenarios.

## Inputs
Generation rules, constraints, random seed policy, content catalog, fairness requirements, performance budget, and validation criteria.

## Context to inspect
Inspect random sources, generation stages, constraints, retries, fallback behavior, serialization, and dependencies on unordered runtime state.

## Core knowledge
Randomness should be controlled and observable. Seeded generators enable reproduction but only if call order and inputs remain stable. Constraint-based generation needs bounded failure behavior rather than infinite retries.

## Procedure
1. Define desired variation and hard validity constraints.
2. Separate deterministic generation inputs from runtime presentation.
3. Use explicit random streams/seeds per subsystem where useful.
4. Build generation in inspectable stages.
5. Validate outputs after each critical stage.
6. Bound retries and define deterministic fallbacks.
7. Record seeds and configuration for bug reports.
8. Analyze distribution and fairness statistically.
9. Stress large seed sets for invalid outputs and performance.
10. Preserve compatibility expectations for saved seeds when required.

## Decision points
Use weighted random selection for simple distributions, constraint solvers/search for interdependent rules, and authored templates plus procedural variation when full generation creates unacceptable quality variance.

## Common failure patterns
Global RNG coupling, infinite retry loops, seeds that do not reproduce due to unstable iteration, biased shuffle/selection, no output validation, and assuming random equals fair.

## Verification
Replay recorded seeds, run thousands of generated cases, validate invariants, inspect distributions, and benchmark worst generation time.

## Expected output
Reproducible procedural generation with bounded runtime and verified validity/fairness properties.

## Stop conditions
Stop when required constraints conflict, generation has no bounded fallback, or compatibility requirements for existing seeds are unknown.