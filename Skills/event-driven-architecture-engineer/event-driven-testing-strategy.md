# Event-Driven Testing Strategy

## Purpose
Design layered tests that prove asynchronous workflows remain correct under timing, duplication, and failure conditions.

## When to use
Use when planning quality gates or increasing confidence in event-driven systems.

## Inputs
Architecture, invariants, contracts, broker technology, failure model, acceptance criteria.

## Context to inspect
Existing unit/integration/E2E tests, test broker setup, fixtures, clocks, retry timing, and observability.

## Core knowledge
Event-driven correctness requires more than happy-path E2E tests. Deterministic unit tests should cover handlers and state transitions; integration tests should cover real serialization/broker/database behavior; targeted system tests cover cross-service workflows and faults.

## Procedure
1. Extract business invariants and failure scenarios.
2. Unit-test pure event/command decisions.
3. Contract-test schemas and compatibility.
4. Integration-test consumer transactions, acknowledgements, and broker behavior.
5. Test duplicates, out-of-order events, poison messages, and retries.
6. Use controllable clocks for timeout workflows.
7. Add a small set of end-to-end business journeys.
8. Add fault injection for critical workflows.
9. Make asynchronous assertions deadline-based, not fixed sleeps.
10. Track flaky tests as defects.

## Decision points
Mock external systems for deterministic domain tests; use real infrastructure for semantics that mocks cannot represent. Keep E2E scope small due to cost and nondeterminism.

## Common failure patterns
Sleep-based tests, mocked brokers only, no duplicate tests, shared mutable test topics, and assertions before eventual convergence.

## Verification
Tests reliably detect injected ordering, duplication, retry, schema, and outage defects without chronic flakiness.

## Expected output
A layered test matrix with explicit coverage of asynchronous failure modes.

## Stop conditions
Stop if acceptance invariants or supported broker semantics are unknown.