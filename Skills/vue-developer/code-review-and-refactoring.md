# Code Review and Refactoring

## Purpose
Review and improve Vue code for correctness, maintainability, security, accessibility, and performance without unnecessary redesign.

## When to use
Use for pull requests, legacy cleanup, framework migrations, and technical-debt reduction.

## Inputs
Diff, requirements, surrounding code, tests, architecture conventions, and runtime evidence.

## Context to inspect
Inspect affected consumers, component contracts, state ownership, routing, API behavior, tests, and established repository conventions.

## Core knowledge
Review should prioritize correctness and risk over stylistic preference. Refactoring changes structure while preserving intended behavior; evidence is needed to prove preservation.

## Procedure
1. Understand requirement and behavioral contract.
2. Review correctness and edge cases first.
3. Check state ownership and reactive semantics.
4. Review security and accessibility boundaries.
5. Check async/race/error behavior.
6. Assess maintainability and duplication.
7. Identify performance concerns only with plausible impact.
8. Separate blocking defects from optional improvements.
9. Refactor in small behavior-preserving steps.
10. Run tests and relevant manual flows.

## Decision points
Request change when correctness, security, accessibility, or maintainability risk is material; suggest when preference or low-risk improvement is optional. Refactor now when it materially reduces change risk; defer unrelated cleanup.

## Common failure patterns
Style-only reviews, rewriting to personal taste, ignoring template accessibility, missing race conditions, broad refactors mixed with feature changes, and approving because tests merely exist.

## Verification
Build/typecheck/test, exercise changed flows, and confirm public component/store contracts remain compatible unless intentionally changed.

## Expected output
Actionable review findings or a focused refactor with preserved behavior.

## Stop conditions
Stop when requirements are unavailable or a proposed refactor crosses ownership/scope boundaries without approval.