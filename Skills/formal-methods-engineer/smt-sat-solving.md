# SMT and SAT Solving

## Purpose
Use SAT and SMT solvers effectively for satisfiability, constraint checking, verification conditions, bounded proofs, and counterexample generation.

## When to use
Use when verification goals can be encoded into decidable or solver-friendly logical fragments. Do not treat solver success as meaningful without validating the encoding and assumptions.

## Inputs
Logical constraints, theory requirements, bounds, verification conditions, expected models, and performance limits.

## Preconditions
Choose theories that match the semantics of integers, reals, arrays, bit-vectors, strings, or uninterpreted functions being modeled.

## Context to inspect
Quantifiers, arithmetic domains, overflow semantics, nonlinear constraints, solver options, timeouts, and prior unsat cores or models.

## Core knowledge
SAT decides propositional satisfiability; SMT extends this with background theories. Encoding quality strongly affects both soundness and performance. Bit-vectors differ materially from mathematical integers, and quantifiers can make otherwise simple problems difficult.

## Procedure
1. Define the exact satisfiability question.
2. Choose theories matching runtime semantics.
3. Encode domain constraints explicitly.
4. Keep assertions named for diagnostics.
5. Test the encoding with known satisfiable and unsatisfiable examples.
6. Inspect models for surprising unconstrained values.
7. Use unsat cores to isolate contradictory assumptions where supported.
8. Reduce quantifiers or nonlinear terms when they cause instability.
9. Separate solver timeout from logical failure.
10. Record solver version, options, and bounds for reproducibility.

## Decision points
Use bit-vectors for machine arithmetic and integers for mathematical reasoning only when overflow is irrelevant or separately proven. Prefer incremental solving for related queries.

## Common failure patterns
Unconstrained variables, integer/bit-vector mismatch, hidden overflow, overusing quantifiers, interpreting timeout as unsat, and trusting opaque encodings.

## Verification
Cross-check small cases manually or with a second encoding, inspect models/cores, and mutation-test constraints.

## Expected output
A reproducible solver encoding, result, diagnostic evidence, and documented assumptions.

## Stop conditions
Stop when the chosen theory does not match system semantics, solver incompleteness prevents the required claim, or timeout makes evidence inconclusive.