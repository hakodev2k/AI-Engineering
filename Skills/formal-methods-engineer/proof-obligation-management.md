# Proof Obligation Management

## Purpose
Define, organize, prioritize, and close proof obligations so formal verification remains traceable, reviewable, and maintainable across system evolution.

## When to use
Use when refinement, contracts, invariants, generated verification conditions, or theorem proving produces many interdependent obligations.

## Inputs
Specification, theorem set, verification conditions, requirement traceability, proof status, risk classification, and change history.

## Preconditions
Each obligation must have an identifiable source and intended assurance claim.

## Context to inspect
Unproven goals, admitted lemmas, solver timeouts, assumptions, dependencies, code/spec changes, and release gates.

## Core knowledge
Not all proof obligations carry equal risk. A Senior engineer distinguishes foundational lemmas from derived obligations, tracks dependency direction, prevents circular reasoning, and treats admitted or assumed facts as explicit assurance debt.

## Procedure
1. Inventory every open obligation and its source.
2. Classify by safety impact, dependency depth, and release criticality.
3. Build a dependency graph among lemmas and obligations.
4. Identify foundational blockers first.
5. Record assumptions, axioms, timeouts, and temporary admissions separately.
6. Assign stable identifiers for traceability.
7. Define evidence required to mark each obligation closed.
8. Re-open dependent obligations when definitions or assumptions change.
9. Automate status reporting in CI where practical.
10. Review residual obligations before release or assurance sign-off.

## Decision points
Prioritize obligations that dominate many downstream proofs or protect high-impact invariants. Accept temporary assumptions only with explicit ownership, rationale, and expiry criteria.

## Common failure patterns
Counting solver success without checking scope, losing provenance, silently admitting lemmas, circular dependencies, and closing obligations that were invalidated by later model changes.

## Verification
Recompute obligation status from source, check dependency consistency, audit assumptions, and confirm closed obligations still reproduce in a clean build.

## Expected output
A current obligation register with status, dependencies, evidence, owners, and residual-risk notes.

## Stop conditions
Stop release-level assurance claims when critical obligations remain admitted, timed out, or depend on unjustified assumptions.