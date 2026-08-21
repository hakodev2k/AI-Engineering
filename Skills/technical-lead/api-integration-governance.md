# API and Integration Governance

## Purpose
Guide teams toward stable, evolvable service contracts and resilient integrations without creating unnecessary bureaucracy.

## When to use
Use for public/internal APIs, events, webhooks, third-party integrations, and cross-team contracts.

## Inputs
Consumer needs, contracts, schemas, ownership, reliability requirements, compatibility constraints.

## Context to inspect
Inspect current conventions, consumers, versioning, retries, timeout behavior, authentication, rate limits, and data ownership.

## Core knowledge
Integration design must make compatibility, failure semantics, idempotency, ownership, and observability explicit. Distributed calls fail independently.

## Procedure
1. Identify producer, consumers, and business semantics.
2. Define contract ownership and lifecycle.
3. Choose synchronous or asynchronous interaction based on coupling and timing needs.
4. Specify validation, errors, timeouts, retries, and idempotency.
5. Define authentication and authorization.
6. Design backward-compatible evolution.
7. Add contract and integration tests.
8. Instrument dependency health and latency.
9. Document rate and availability assumptions.
10. Plan deprecation and migration.

## Decision points
Use synchronous APIs when immediate response is required and dependency coupling is acceptable; use messaging when temporal decoupling and durable processing matter.

## Common failure patterns
Unbounded retries, breaking schema changes, shared databases as implicit APIs, missing idempotency, and undocumented ownership.

## Verification
Consumers pass contract tests, failure paths behave predictably, and compatibility/deprecation rules are demonstrable.

## Expected output
An integration contract with lifecycle, resilience, security, and operational expectations.

## Stop conditions
Escalate when ownership, data authority, or required reliability cannot be agreed across teams.