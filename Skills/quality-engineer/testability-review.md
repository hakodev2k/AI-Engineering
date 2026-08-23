# Testability Review

## Purpose
Evaluate whether a design can be controlled, observed, isolated, and verified efficiently before test cost becomes embedded.

## When to use
Use during architecture/design review or when testing is slow, brittle, or dependent on manual setup.

## Inputs
Designs, APIs, code, dependency graph, configuration, observability plan.

## Context to inspect
Inspect dependency injection, deterministic behavior, clocks/randomness, side effects, state boundaries, diagnostics, feature flags, and interfaces.

## Core knowledge
Testability improves when inputs are controllable, outputs observable, dependencies replaceable where appropriate, and state transitions explicit. Do not distort production design solely for tests.

## Procedure
1. Identify behaviors requiring evidence.
2. Locate control and observation points.
3. Find nondeterministic or hidden dependencies.
4. Assess isolation boundaries and setup cost.
5. Review error paths and diagnostic signals.
6. Propose the smallest design improvements.
7. Validate that changes improve both maintainability and testing.
8. Record unresolved limitations.

## Decision points
Prefer production-useful seams and observability over test-only hooks. Accept integration testing when abstraction would add unjustified complexity.

## Common failure patterns
Private-method testing, test-only production switches, global mutable state, hard-coded time/network dependencies, and opaque errors.

## Verification
Demonstrate representative tests can arrange state, trigger behavior, and assert outcomes deterministically.

## Expected output
A testability assessment with prioritized design improvements.

## Stop conditions
Escalate when improving testability materially changes public contracts or architecture ownership is outside scope.