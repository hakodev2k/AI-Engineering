# Firmware Test Strategy

## Purpose
Build layered verification that catches logic, integration, hardware, timing, and regression defects at the cheapest reliable level.

## When to use
Use when establishing quality strategy, adding critical features, reducing regressions, or preparing releases.

## Inputs
Requirements, architecture, risk analysis, codebase, hardware dependencies, CI capabilities, defect history, and release criteria.

## Context to inspect
Inspect test seams, host-build support, driver abstractions, simulators, HIL coverage, static analysis, compiler warnings, and production diagnostics.

## Core knowledge
Firmware needs a test pyramid adapted to hardware: host unit tests for logic, target integration tests for platform behavior, HIL for physical interactions, and static/dynamic analysis for classes difficult to exercise. Coverage percentage alone is not a quality goal.

## Procedure
1. Rank behaviors by impact and failure likelihood.
2. Map each risk to the lowest test level that provides credible evidence.
3. Separate pure logic from hardware dependencies to improve testability.
4. Add unit tests for algorithms/state machines/parsers.
5. Add target integration tests for drivers/RTOS/platform services.
6. Add HIL for electrical/timing/reset/update risks.
7. Include static analysis and warning policies.
8. Define release gates and retained artifacts.
9. Review escaped defects to close coverage gaps.

## Decision points
Mock at stable boundaries, not every function. Prefer fakes/models when behavior matters. Accept manual tests only where automation cost exceeds recurring risk and document the rationale.

## Common failure patterns
Only testing on hardware, over-mocking registers, chasing line coverage, no optimized-target tests, flaky sleep-based assertions, and no regression test after a field defect.

## Verification
Run all layers on representative configurations, prove known defects are detected, inspect failures for diagnosability, and confirm release gates are reproducible.

## Expected output
A risk-based firmware verification matrix with test levels, automation, ownership, and release evidence.

## Stop conditions
Stop when critical requirements or supported hardware variants are unknown.