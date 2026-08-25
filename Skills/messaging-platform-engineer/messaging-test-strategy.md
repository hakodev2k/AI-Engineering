# Messaging Test Strategy

## Purpose
Build a test strategy that proves message contracts, broker behavior, delivery semantics, and failure recovery rather than only testing happy-path producers and consumers.

## When to use
Use when designing CI/CD quality gates, onboarding a critical workload, or reducing regressions in messaging changes.

## Inputs
- Message contracts
- Broker configuration
- Producer and consumer code
- Failure scenarios
- SLOs and correctness invariants

## Context to inspect
Inspect unit, integration, contract, load, chaos, and replay tests; environment fidelity; test data; and current production failure modes.

## Core knowledge
Messaging tests must cover asynchronous timing, retries, duplicates, ordering, broker failover, schema compatibility, lag recovery, and eventually consistent outcomes. Over-mocking brokers can hide the failures that matter most.

## Procedure
1. Define business invariants and delivery guarantees.
2. Unit test deterministic routing, serialization, and failure classification.
3. Contract-test schemas and compatibility rules.
4. Integration-test against a real broker or faithful managed-service test environment.
5. Test duplicate delivery and idempotency.
6. Test poison messages, retry exhaustion, and DLQ routing.
7. Test broker restart, network interruption, and consumer rebalance.
8. Load-test representative message sizes and concurrency.
9. Add replay/regression cases for prior incidents.
10. Gate releases on explicit correctness and performance thresholds.

## Decision points
Use ephemeral local brokers for fast integration feedback, but validate provider-specific behavior in an environment close to production before high-risk releases.

## Common failure patterns
- Mock-only messaging tests
- Sleeps instead of eventual-condition polling
- No duplicate/replay testing
- Tiny synthetic payloads unlike production
- Green tests despite schema incompatibility

## Verification
Run the complete suite repeatedly, verify deterministic outcomes, confirm expected failures are detected, and compare load behavior to production SLOs.

## Expected output
A layered messaging test plan with automated correctness, resilience, contract, and performance evidence.

## Stop conditions
Stop when test environments cannot reproduce required broker semantics, correctness invariants are undefined, or destructive tests could affect shared production infrastructure.