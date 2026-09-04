# Compiler Correctness Testing

## Purpose
Build layered test strategies that detect semantic regressions, miscompilations, unsupported cases, and cross-backend inconsistencies before production.

## When to use
Use when adding transformations, frontends, operators, backends, dynamic-shape support, or when recurring compiler bugs reveal coverage gaps.

## Inputs
Compiler pipeline, reference executor, operator specs, target backends, historical bugs, supported dtype/shape matrix.

## Context to inspect
Inspect unit tests, verifier tests, transformation golden tests, differential tests, fuzzing, end-to-end model suites, hardware coverage, and flaky tests.

## Core knowledge
Compiler correctness requires testing at multiple semantic layers. Structural IR tests detect rewrite regressions; differential execution catches semantic errors; randomized generation explores combinations humans miss.

## Procedure
1. Classify the change by semantic risk and affected layers.
2. Add focused unit/verifier tests for local invariants.
3. Add before/after transformation tests when IR structure matters.
4. Differential-test compiled output against a trusted reference.
5. Cover dtype, shape, layout, device, and boundary variations.
6. Add negative tests for unsupported or illegal cases.
7. Reproduce historical bugs as permanent regressions.
8. Use fuzz/property testing for combinatorial transformations where feasible.
9. Run representative end-to-end models on supported backends.
10. Track nondeterminism and numerical tolerance explicitly.
11. Ensure failures produce minimal actionable diagnostics.

## Decision points
Use exact comparisons for integer/bitwise semantics; numerical tolerances for floating point; task-level metrics when local numeric drift may compound. Prefer semantic assertions over brittle textual snapshots unless exact IR form is the contract.

## Common failure patterns
Only testing happy-path shapes, overly loose tolerances, snapshot tests that miss semantic errors, no negative cases, backend gaps, and failing to preserve bug reproducers.

## Verification
Run the full relevant matrix, confirm tests fail on a known broken variant when practical, and ensure compiled results match reference semantics across target configurations.

## Expected output
A risk-proportionate compiler test suite with regression evidence and clearly defined correctness criteria.

## Stop conditions
Stop if no trusted reference exists for a semantic change, target hardware cannot be tested for a target-specific change, or tolerances cannot be justified.