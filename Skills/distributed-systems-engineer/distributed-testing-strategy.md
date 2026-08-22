# Distributed Testing Strategy

## Purpose
Build a test strategy that verifies contracts, failure behavior, concurrency, compatibility, and end-to-end invariants without relying only on brittle full-system tests.

## When to use
Use for multi-service systems, asynchronous workflows, distributed data, and critical integrations.

## Inputs
Architecture, contracts, invariants, failure model, deployment model, and production incident history.

## Context to inspect
Inspect unit/integration tests, contract tests, ephemeral infrastructure, test data, message brokers, clocks, retries, and CI constraints.

## Core knowledge
Distributed correctness spans boundaries. Layer tests: deterministic local logic, component integration, producer/consumer contracts, concurrency/failure tests, and a small number of high-value end-to-end journeys.

## Procedure
1. Identify critical business and data invariants.
2. Map each invariant to the cheapest reliable test layer.
3. Add contract tests for independently deployed boundaries.
4. Use real protocol/storage implementations for important integration behavior where practical.
5. Test duplicate, reorder, timeout, retry, crash, and concurrency cases.
6. Control time and randomness for deterministic tests.
7. Build restartable isolated test data.
8. Keep end-to-end tests focused on critical journeys.
9. Capture diagnostics automatically on failure.
10. Convert significant production incidents into regression tests.

## Decision points
Mock pure boundaries for speed, but use real infrastructure when semantics such as transactions, broker acknowledgment, or serialization are the subject under test.

## Common failure patterns
Only happy-path E2E tests, mocking broker/database semantics, sleeps for synchronization, shared mutable test environments, and ignoring race conditions.

## Verification
Run tests repeatedly and under parallelism; inject representative failures and confirm stable diagnostic output.

## Expected output
A layered distributed test suite mapped to invariants and failure modes.

## Stop conditions
Escalate when a critical guarantee cannot be tested or observed with available environments/tooling.