# Stream Testing Strategy

## Purpose
Verify streaming logic across contracts, time, ordering, duplicates, failures, state, and real broker integration.

## When to use
Use when implementing or changing streaming applications and before high-risk releases.

## Inputs
Topology, event contracts, invariants, failure semantics, framework/broker, acceptance criteria.

## Context to inspect
Existing unit/integration tests, fixtures, embedded/containerized brokers, schema registry, CI limits.

## Core knowledge
Streaming tests must cover deterministic transformations plus nondeterministic delivery conditions. Integration tests are essential for serialization, offsets, partitions, transactions, and broker behavior.

## Procedure
1. Extract business invariants into deterministic tests.
2. Add contract/serialization tests.
3. Test duplicates, disorder, late events, and missing data.
4. Test state recovery and checkpoint behavior.
5. Use real broker-compatible integration environments.
6. Test retry/DLQ paths.
7. Add representative load tests for critical flows.
8. Keep fixtures explicit about timestamps and keys.

## Decision points
Mock pure dependencies in unit tests; use actual broker/database containers for protocol and delivery behavior. Avoid end-to-end tests for logic better proven deterministically.

## Common failure patterns
Happy-path-only tests; wall-clock sleeps; random unseeded timing; mocks that hide broker semantics; no crash-boundary tests.

## Verification
CI passes deterministically and failure-injection tests reproduce intended recovery semantics.

## Expected output
Layered test suite with traceable coverage of streaming invariants.

## Stop conditions
Stop release when critical delivery/state behavior lacks reproducible verification.