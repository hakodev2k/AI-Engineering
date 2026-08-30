# Engineering Standards

## Purpose
Define and evolve engineering standards that reduce avoidable variation while preserving team autonomy where local choice is valuable.

## When to use
Use when repeated incidents, inconsistent implementation, security gaps, or duplicated tooling indicate a need for shared engineering policy or paved roads.

## Inputs
Incident patterns, codebase conventions, platform capabilities, developer feedback, security requirements, operational constraints.

## Preconditions
There is evidence that standardization solves a recurring organizational problem.

## Context to inspect
Existing standards, exceptions, tooling adoption, team workflows, platform APIs, compliance requirements, and migration cost.

## Core knowledge
Standards should optimize total engineering cost, not stylistic uniformity. Strong standards are narrow, enforceable where appropriate, versioned, and paired with migration support and an exception path.

## Procedure
1. Define the recurring problem and affected scope.
2. Measure the cost of current variation.
3. Identify the minimum standard needed.
4. Compare mandatory policy, recommended guidance, and automated enforcement.
5. Design migration and compatibility paths.
6. Provide reference implementations or tooling when useful.
7. Define exception criteria and ownership.
8. Pilot with representative teams.
9. Measure adoption and unintended friction.
10. Revise or retire standards when evidence changes.

## Decision points
Mandate standards for material security, reliability, or interoperability risks. Prefer guidance when local variation has low organizational cost. Automate checks only when false positives are manageable.

## Common failure patterns
Standards by preference, no migration path, excessive policy surface, stale documentation, central-team bottlenecks, and no exception mechanism.

## Verification
Confirm adoption is measurable, target failure modes decline, developer friction is acceptable, and exceptions remain controlled.

## Expected output
A scoped engineering standard with rationale, requirements, migration guidance, enforcement, and exception policy.

## Stop conditions
Stop when benefits cannot be demonstrated or the proposed standard would centralize decisions without reducing meaningful risk or cost.