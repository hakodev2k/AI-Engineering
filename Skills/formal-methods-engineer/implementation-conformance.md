# Implementation Conformance

## Purpose
Establish evidence that production code conforms to the behaviors and invariants proven in a formal model or specification.

## When to use
Use after verifying an abstract design, during implementation review, and whenever code changes may drift from formally verified behavior.

## Inputs
Formal specification, implementation, interface contracts, invariants, traces, tests, generated artifacts, and refinement mapping.

## Preconditions
There must be an explicit relation between implementation state/actions and specification state/actions.

## Context to inspect
Code paths, persistence, concurrency primitives, serialization, error handling, retries, feature flags, deployment configuration, and any generated code.

## Core knowledge
Verification of a model is not verification of code unless conformance is established. Techniques include refinement proofs, verified extraction, runtime monitoring, model-based testing, trace checking, refinement types, and carefully reviewed correspondence arguments.

## Procedure
1. Identify which formal claims must hold in production.
2. Define mappings from implementation state and events to model concepts.
3. Audit implementation behavior omitted from the model.
4. Compare atomicity and ordering assumptions with real runtime semantics.
5. Generate model-based tests or trace validators where practical.
6. Add runtime assertions for cheap critical invariants.
7. Review error, retry, cancellation, and recovery paths explicitly.
8. Validate serialization and numeric semantics against the model.
9. Re-run conformance evidence after relevant code/configuration changes.
10. Document gaps where correspondence remains manual.

## Decision points
Prefer verified code generation or refinement proofs for highest assurance; use model-based testing and trace checking when full code proof is disproportionate to risk.

## Common failure patterns
Assuming code matches variable names in the model, ignoring integer overflow or weak memory, missing configuration-dependent behavior, checking only happy paths, and allowing model and implementation to evolve independently.

## Verification
Run conformance tests, compare real traces with allowed traces, inject invariant violations, and review the mapping independently from the original implementer.

## Expected output
A documented conformance mapping, executable evidence where possible, known gaps, and change-trigger rules.

## Stop conditions
Stop assurance claims when implementation semantics materially differ from the model, critical behavior lacks a mapping, or configuration can bypass verified controls.