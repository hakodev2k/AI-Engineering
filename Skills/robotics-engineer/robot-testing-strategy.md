# Robot Testing Strategy

## Purpose
Build layered test coverage for robotics software and hardware so failures are found at the cheapest safe level and critical behaviors are verified on representative systems.

## When to use
Use when establishing release criteria, adding major functionality, addressing regressions, or improving weak hardware-dependent test coverage.

## Inputs
Requirements, architecture, failure history, hardware availability, simulation capability, safety constraints, deployment environments.

## Preconditions
Expected behaviors and acceptance thresholds are defined.

## Context to inspect
Unit tests, component tests, simulation, hardware-in-loop, system tests, field tests, test fixtures, datasets, CI constraints, flaky-test history.

## Core knowledge
Robotics requires a pyramid spanning pure software tests, deterministic replay, simulation, hardware-in-loop, bench tests, and full-system scenarios. Physical tests are expensive and hazardous, so lower layers should isolate logic while upper layers validate integration and reality.

## Procedure
1. Trace critical requirements and hazards to test evidence.
2. Classify logic by the lowest viable test layer.
3. Create deterministic tests for algorithms and state transitions.
4. Add recorded-data replay for sensor-driven behavior.
5. Use simulation for scenario breadth and fault injection.
6. Add hardware-in-loop for timing, drivers, and actuator/sensor integration.
7. Define full-system nominal and degraded scenarios.
8. Establish repeatability, environmental setup, and data capture.
9. Set pass/fail thresholds and quarantine policy for flaky tests.
10. Gate releases on risk-weighted evidence, not raw test counts.

## Decision points
Move tests upward only when lower layers cannot expose the required physical interaction. Keep non-deterministic field tests out of strict CI gates unless reproducibility is acceptable.

## Common failure patterns
Only testing in simulation, excessive end-to-end dependence, weak assertions, manual-only acceptance, hidden fixture variation, ignoring intermittent faults, and test environments unlike deployment.

## Verification
Audit requirement-to-test traceability, reproduce known past failures, measure flake rate, and confirm release-blocking tests run on representative configurations.

## Expected output
Layered test matrix, scenario definitions, fixtures/datasets, release gates, and evidence-retention rules.

## Stop conditions
Stop release when critical requirements or safety controls lack credible verification.