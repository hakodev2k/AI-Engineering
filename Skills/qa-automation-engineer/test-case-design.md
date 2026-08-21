# Test Case Design

## Purpose
Convert requirements and risks into compact, high-value test cases that expose meaningful defects.

## When to use
Use for feature design, regression planning, defect prevention, and automation candidate selection.

## Inputs
Requirements, acceptance criteria, domain rules, API/UI contracts, defect history.

## Context to inspect
Happy paths, boundaries, state transitions, permissions, concurrency, invalid inputs, dependencies, and irreversible actions.

## Core knowledge
Apply equivalence partitioning, boundary analysis, decision tables, state-transition testing, pairwise combinations, error guessing, and property/invariant thinking. A Senior tester targets failure mechanisms rather than enumerating superficial permutations.

## Procedure
1. Identify observable outcomes and invariants.
2. Partition input/state space into meaningful classes.
3. Test boundaries and transitions.
4. Model business-rule combinations with decision tables.
5. Add negative, permission, retry, duplicate, timeout, and concurrency cases where relevant.
6. Prioritize by risk and production likelihood.
7. Remove redundant cases.
8. Define deterministic preconditions and assertions.
9. Mark which cases deserve automation and at what layer.

## Decision points
Automate stable repeatable cases; retain exploratory testing for ambiguous or rapidly changing behavior. Prefer properties/invariants when examples cannot cover a large state space.

## Common failure patterns
Only happy paths, one test per requirement sentence, missing boundary cases, asserting implementation details, excessive combinatorial cases, vague expected results.

## Verification
Review traceability to risks and rules; execute representative cases; confirm each case can fail for a distinct meaningful reason.

## Expected output
A minimal, risk-focused set of executable test cases with explicit preconditions, actions, and expected outcomes.

## Stop conditions
Stop when requirements conflict or expected behavior cannot be established with product/domain owners.