# Technical Claim Verification

## Purpose
Verify technical claims before they appear in talks, blogs, demos, social content, launch material, or community answers.

## When to use
Use for benchmarks, compatibility statements, performance claims, architecture guidance, security statements, and competitive comparisons.

## Inputs
Claim, product/version, evidence, test environment, documentation, source code or engineering confirmation when available.

## Context to inspect
Scope, versions, configuration, measurement method, edge cases, known limitations, release status, and disclosure constraints.

## Core knowledge
A claim must be precise enough to falsify. Benchmarks require representative workloads and transparent methodology. Absence of observed failure is not proof of security or universal compatibility.

## Procedure
1. Rewrite the claim into a precise testable statement.
2. Identify version, environment, workload, and exclusions.
3. Prefer primary evidence: released behavior, specification, reproducible test, or accountable engineering owner.
4. Reproduce material quantitative claims independently where feasible.
5. Check counterexamples and boundary conditions.
6. Separate measured fact from interpretation and prediction.
7. Add qualifiers required for accuracy.
8. Record evidence and freshness date.
9. Revalidate volatile claims near publication.

## Decision points
Remove a claim if evidence is weak and qualification would make it meaningless. Use ranges/distributions rather than single benchmark numbers when variance matters.

## Common failure patterns
Cherry-picked benchmarks, comparing mismatched configurations, extrapolating from demos, using unreleased behavior as current fact, and turning engineering hypotheses into guarantees.

## Verification
A reviewer must be able to trace each material claim to reproducible evidence or authoritative source and understand its scope and limitations.

## Expected output
Publication-ready claims with evidence, qualifiers, versions, and explicit uncertainty where necessary.

## Stop conditions
Do not publish when evidence conflicts, test methodology is invalid, confidential information is required to substantiate the claim, or responsible owners cannot confirm critical behavior.