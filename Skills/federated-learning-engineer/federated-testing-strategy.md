# Federated Testing Strategy

## Purpose
Create a layered test strategy for federated systems covering local training correctness, coordinator workflows, distributed failure modes, privacy controls, and model behavior.

## When to use
Use when introducing FL infrastructure, changing aggregation or privacy logic, preparing releases, or investigating regressions that unit tests did not catch.

## Inputs
Client runtime, coordinator, aggregation code, protocol definitions, simulators, privacy mechanisms, deployment topology, and acceptance criteria.

## Context to inspect
Inspect deterministic components, nondeterministic training behavior, protocol boundaries, failure injection capabilities, representative client classes, and production-only dependencies.

## Core knowledge
FL needs more than ML tests. Correctness spans numerical algorithms, protocol compatibility, distributed state transitions, security/privacy invariants, and statistical behavior across heterogeneous clients.

## Procedure
1. Unit-test local preprocessing, training steps, weighting, serialization, clipping, and aggregation math.
2. Add contract tests for client/server protocol versions.
3. Build deterministic small-client integration fixtures.
4. Test duplicate, late, malformed, and stale updates.
5. Inject client dropout, coordinator restart, network interruption, and storage failure.
6. Test privacy-accounting and secure-aggregation invariants independently.
7. Run statistical tests across seeds and heterogeneous partitions.
8. Add end-to-end tests on representative client runtimes.
9. Separate fast presubmit tests from expensive stochastic suites.
10. Define release gates for correctness, privacy, quality, and resilience.

## Decision points
Mock external systems for fast logic tests, but use real serialization, persistence, and protocol stacks in integration tests. Use statistical tolerance rather than exact equality for stochastic outcomes.

## Common failure patterns
- Only testing happy-path rounds.
- Flaky tests caused by uncontrolled randomness.
- No compatibility tests across client versions.
- Privacy logic untested independently.
- Simulator passes while real clients fail under resource limits.

## Verification
Verify suites catch seeded faults in aggregation, version mismatch, dropout handling, privacy accounting, and recovery before release.

## Expected output
A test matrix, fixtures, failure-injection plan, release gates, and evidence of coverage across client/server/privacy/model layers.

## Stop conditions
Stop if production-critical invariants cannot be expressed as tests or representative client environments are unavailable for release validation.