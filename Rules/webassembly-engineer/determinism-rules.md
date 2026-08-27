# Determinism Rules

## Purpose
Control nondeterminism where reproducibility, consensus, caching, testing, or replay depends on stable execution.

## Scope
Applies to clocks, randomness, concurrency, floating-point behavior, iteration order, host state, and external I/O.

## MUST
- Systems requiring deterministic execution MUST enumerate and control all nondeterministic inputs.
- Time and randomness MUST be injected through explicit interfaces when deterministic replay is required.
- Deterministic claims MUST be supported by repeatability tests across the supported runtime matrix.
- Host calls that can vary externally MUST be excluded, recorded, or modeled when replay correctness depends on them.

## MUST NOT
- Tests MUST NOT rely on unspecified map iteration, scheduling, wall-clock timing, or ambient randomness when exact output matters.
- Determinism MUST NOT be claimed solely because a module has no obvious I/O.
- Floating-point reproducibility MUST NOT be assumed across environments without validation appropriate to the requirement.

## SHOULD
- Use seeded randomness for reproducible tests.
- Record external inputs for replayable production investigations where feasible.
- Prefer deterministic serialization and canonical ordering for hashed or signed data.

## Exceptions
Nondeterminism is acceptable when it is a deliberate requirement and downstream correctness does not depend on exact replay; this must be documented.

## Verification
Repeat identical workloads, compare outputs and state transitions, run cross-runtime tests, and instrument host calls to confirm all nondeterministic sources are known.