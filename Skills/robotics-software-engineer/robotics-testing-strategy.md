# Robotics Testing Strategy

## Purpose
Design layered verification that catches algorithmic, integration, timing, hardware, and safety regressions before they reach field operation.

## When to use
Use when establishing CI, adding autonomy features, reducing regressions, or defining release gates.

## Inputs
- System architecture
- Safety requirements
- Failure history
- Simulation/HIL capability
- Hardware availability
- Acceptance criteria

## Preconditions
Critical behaviors and measurable acceptance criteria must be identifiable.

## Context to inspect
Inspect unit/integration tests, recorded datasets, simulation scenarios, HIL rigs, robot test procedures, flaky tests, coverage gaps, and release gates.

## Core knowledge
Senior robotics testing spans deterministic unit tests, property tests, recorded-data regression, software-in-loop, simulation, HIL, physical-robot tests, timing tests, fault injection, and scenario-based acceptance.

## Procedure
1. Map hazards and mission-critical behaviors to verification evidence.
2. Put pure math and deterministic logic under fast unit tests.
3. Test interfaces and lifecycle behavior with integration tests.
4. Add recorded-data regressions for perception and estimation.
5. Use simulation for repeatable scenario coverage.
6. Use HIL for timing, firmware, bus, and device interaction.
7. Reserve physical-robot tests for irreducible real-world behavior.
8. Add fault injection for sensor loss, stale data, network loss, and actuator faults.
9. Track flaky tests as defects rather than normalizing retries.
10. Define quantitative release thresholds and required evidence.
11. Preserve field failures as regression cases.

## Decision points
Move tests to the cheapest layer that still reproduces the risk. Do not replace hardware evidence with simulation when hardware dynamics or timing are material. Use statistical thresholds for nondeterministic algorithms rather than brittle exact equality.

## Common failure patterns
- Mostly happy-path simulation tests
- End-to-end tests with no diagnostic isolation
- Retrying flaky tests until green
- No timing or dropout tests
- Physical tests without reproducible scenario definitions

## Verification
Confirm each critical requirement has an automated or controlled test, failures are diagnosable, release gates run reliably, and representative historical incidents are covered.

## Expected output
A layered robotics test matrix with owners, environments, acceptance thresholds, release gates, and regression datasets.

## Stop conditions
Stop if safety-critical requirements have no credible verification method, test rigs are unsafe, or a release would depend on skipped or persistently flaky critical tests.