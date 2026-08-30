# Theorem Proving

## Purpose
Construct machine-checked proofs for properties that require stronger assurance than finite-state exploration can provide.

## When to use
Use for parameterized systems, algorithms over unbounded domains, cryptographic or arithmetic properties, refinement proofs, and correctness-critical components where exhaustive model checking is insufficient.

## Inputs
Formal definitions, theorem statements, assumptions, invariants, supporting lemmas, and chosen proof assistant.

## Preconditions
The semantics and theorem scope must be stable enough to justify proof investment.

## Context to inspect
Existing libraries, trusted computing base, axioms, imported lemmas, definitions, automation, extraction/code-generation path, and proof maintenance history.

## Core knowledge
A machine-checked proof is only as strong as its definitions, assumptions, axioms, and trusted kernel. Induction, rewriting, case analysis, contradiction, extensionality, and domain-specific automation are tools; proof structure should remain understandable and maintainable.

## Procedure
1. State the theorem in terms of externally meaningful behavior.
2. Audit definitions and assumptions before proving anything.
3. Identify induction variables or structural decomposition.
4. Prove small reusable lemmas first.
5. Keep proof obligations local and named.
6. Use automation for routine goals but inspect what it relies on.
7. Minimize axioms and unsafe escape hatches.
8. Refactor duplicated proof patterns into libraries.
9. Re-run the complete proof after definition changes.
10. Document the theorem-to-requirement trace and trusted base.

## Decision points
Prefer automated solvers for decidable fragments; use interactive proofs when domain structure or induction dominates. Avoid proving implementation trivia that does not support an assurance claim.

## Common failure patterns
Proving the wrong theorem, hiding assumptions in definitions, excessive opaque automation, unnecessary axioms, brittle tactic scripts, and confusing successful type checking with meaningful requirements coverage.

## Verification
Rebuild proofs from a clean environment, inspect axioms/dependencies, test altered definitions, and peer-review theorem statements independently from proof scripts.

## Expected output
Machine-checked theorems, supporting lemmas, assumption inventory, traceability, and reproducible proof instructions.

## Stop conditions
Stop when theorem semantics are disputed, required axioms undermine the intended claim, or proof maintenance cost exceeds the agreed assurance need.