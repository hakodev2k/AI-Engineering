# Firmware Test Strategy

## Purpose
Create layered verification that catches logic, integration, timing and hardware failures efficiently.

## When to use
Use when planning quality, adding major features, reducing regressions or reviewing test gaps.

## Inputs
Requirements, architecture, risks, interfaces, supported hardware and CI capabilities.

## Context to inspect
Existing unit, integration, hardware-in-loop, system and manufacturing tests plus field failure history.

## Core knowledge
Different test levels find different defects. Host tests give speed; target tests validate platform assumptions; system tests validate behavior and timing.

## Procedure
1. Rank failure risks and critical requirements.
2. Map each risk to the cheapest credible test level.
3. Build host-testable seams for pure logic.
4. Add target integration tests for hardware assumptions.
5. Cover boundaries, resets and fault paths.
6. Define deterministic fixtures and test data.
7. Automate stable tests in CI.
8. Track flaky tests as defects.
9. Review coverage against field failures.

## Decision points
Mock at architectural boundaries, not every function. Prefer real target integration when hardware semantics are central to the behavior.

## Common failure patterns
Only happy-path tests, excessive mocking, no target coverage, timing-dependent flaky tests and treating code coverage as proof of correctness.

## Verification
Demonstrate requirement/risk coverage and run the suite repeatedly across supported configurations.

## Expected output
A risk-based test matrix and reliable automated suite.

## Stop conditions
Escalate when critical behavior cannot be tested with available fixtures or target access.