# IR Design and Invariants

## Purpose
Design, extend, and review intermediate representations (IRs) that make ML program semantics explicit enough for reliable optimization and lowering.

## When to use
Use when adding a new IR dialect, changing operator semantics, introducing shape/layout metadata, or debugging transformations that violate compiler assumptions.

## Inputs
Source semantics, target requirements, existing IR definitions, verifier rules, optimization needs, serialization constraints.

## Context to inspect
Inspect operation definitions, type system, regions/blocks, effects, attributes, shape representation, layout/device annotations, canonical forms, parser/printer behavior, and verifier coverage.

## Core knowledge
An IR is a contract. Good IRs encode semantic invariants rather than relying on pass ordering or comments. Strong verifiers make illegal states unrepresentable or immediately diagnosable.

## Procedure
1. Define the semantic level represented by the IR.
2. List invariants required by downstream passes.
3. Decide which properties belong in types, attributes, operands, or regions.
4. Specify side effects, aliasing, shape, layout, dtype, and device semantics.
5. Define canonical forms and illegal forms.
6. Implement or review structural and semantic verification.
7. Add parser/printer round-trip tests.
8. Add positive and negative verifier tests.
9. Check compatibility with serialization and versioning needs.
10. Evaluate whether proposed fields duplicate derivable information.
11. Test representative rewrites for invariant preservation.

## Decision points
Encode properties in types when they participate broadly in legality and dispatch; prefer attributes for operation-specific metadata. Avoid over-constraining early IRs if later specialization is required.

## Common failure patterns
Implicit semantics, duplicated metadata, weak verifiers, inconsistent shape meaning, stale attributes after rewrites, and IR design coupled to one optimization pass.

## Verification
Round-trip textual/serialized IR, run verifier suites, exercise transformation pipelines, and confirm invalid programs are rejected at the earliest responsible layer.

## Expected output
A stable IR design or review containing explicit invariants, representation choices, verifier requirements, compatibility concerns, and tests.

## Stop conditions
Stop if source semantics are ambiguous, downstream consumers disagree on invariants, or the change silently alters serialized compatibility without an approved migration plan.