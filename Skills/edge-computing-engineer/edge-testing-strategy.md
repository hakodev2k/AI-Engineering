# Edge Testing Strategy

## Purpose
Create a layered test strategy for edge software across unit, integration, hardware-in-the-loop, network-fault, upgrade, and fleet scenarios.

## When to use
Use when defining release gates, reducing field regressions, or testing new device classes and edge services.

## Inputs
Architecture, hardware variants, critical workflows, failure modes, release cadence, lab capabilities.

## Context to inspect
Inspect current test suites, simulators, device labs, CI, staging fleets, network emulation, and production defect history.

## Core knowledge
Edge systems fail at boundaries between software, hardware, networks, time, storage, and remote operations. Tests must cover those interactions rather than relying only on application unit tests.

## Procedure
1. Identify safety-, revenue-, and availability-critical workflows.
2. Map likely failures across device, network, storage, clock, and cloud dependencies.
3. Cover deterministic logic with fast unit tests.
4. Add protocol and persistence integration tests.
5. Use simulators for broad scenario coverage.
6. Use real hardware for driver, performance, thermal, and update validation.
7. Inject network loss, clock skew, disk pressure, and process restarts.
8. Test OTA upgrade and rollback across supported versions.
9. Maintain a small production-like canary fleet.
10. Convert escaped field defects into regression tests.

## Decision points
Use simulation for breadth and hardware-in-the-loop for fidelity. Do not require expensive hardware tests for logic that can be proven cheaply elsewhere.

## Common failure patterns
Cloud-only integration tests, one hardware model, no long-duration tests, no power-loss tests, flaky physical labs without diagnostics.

## Verification
Demonstrate test coverage against documented failure modes and confirm release gates catch known regressions.

## Expected output
A risk-based edge testing matrix with environments, fault cases, release gates, and regression ownership.

## Stop conditions
Stop when critical hardware or failure modes cannot be reproduced and release risk cannot be bounded.