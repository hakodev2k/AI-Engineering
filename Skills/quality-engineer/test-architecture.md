# Test Architecture

## Purpose
Design a maintainable test system with clear layers, boundaries, fixtures, data ownership, and execution paths.

## When to use
Use when establishing or restructuring automated quality coverage.

## Inputs
Application architecture, test suites, CI pipeline, environments, dependencies, runtime constraints.

## Context to inspect
Inspect module boundaries, existing frameworks, setup cost, shared fixtures, external dependencies, execution duration, and flakiness.

## Core knowledge
A test architecture should optimize confidence, diagnosability, isolation, and feedback time. The test pyramid is guidance, not a quota; architecture determines useful seams.

## Procedure
1. Map system boundaries and quality risks.
2. Define unit, component, integration, contract, and E2E responsibilities.
3. Choose stable test seams.
4. Design fixture and test-data lifecycle.
5. Isolate external dependencies deliberately.
6. Define naming, tagging, parallelism, and retries policy.
7. Design artifacts and failure diagnostics.
8. Integrate suites into appropriate CI stages.
9. Measure runtime, flake rate, and defect detection.
10. Refactor duplicated or low-value coverage.

## Decision points
Use real dependencies where fidelity matters; use fakes where control and speed dominate. Avoid mocking implementation details.

## Common failure patterns
E2E-heavy suites, shared mutable state, hidden setup, framework-driven architecture, and retries masking defects.

## Verification
Run suites repeatedly and in parallel; verify deterministic outcomes, useful diagnostics, and acceptable feedback time.

## Expected output
A documented, maintainable test architecture and execution model.

## Stop conditions
Escalate when required test seams need product architecture changes or environments cannot provide required fidelity.