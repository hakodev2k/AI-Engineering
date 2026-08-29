# Integration Planning

## Purpose
Plan customer integrations so dependencies, contracts, security boundaries, failure handling, ownership, and rollout risks are explicit before implementation.

## When to use
Use for new APIs, identity integrations, data pipelines, webhooks, messaging, or third-party service connections.

## Inputs
Integration goals, system owners, API contracts, data classifications, network requirements, authentication model, volume, latency, and failure expectations.

## Context to inspect
Existing integration patterns, rate limits, versioning, retries, idempotency, timeout policy, secrets handling, observability, test environments, and support boundaries.

## Core knowledge
Integrations fail at boundaries: contracts, ownership, retries, security, and change coordination. A Senior TAM reduces ambiguity before it becomes production risk.

## Procedure
1. Define the producer, consumer, and business outcome.
2. Document data and control flow end to end.
3. Validate contracts, authentication, authorization, and network paths.
4. Define error handling, timeout, retry, and idempotency behavior.
5. Identify rate, capacity, and sequencing constraints.
6. Establish test cases and rollback conditions.
7. Assign operational ownership and escalation paths.
8. Plan phased rollout and post-launch validation.

## Decision points
Prefer asynchronous integration when coupling and latency permit; prefer synchronous calls when immediate response is required. Avoid retries where operations are not idempotent.

## Common failure patterns
Undefined ownership, retry storms, hidden rate limits, credential sharing, missing version strategy, and production-only testing.

## Verification
Run representative integration tests, failure tests, and volume checks; confirm observability and support ownership.

## Expected output
A reviewed integration plan with contracts, dependencies, controls, tests, rollout, and operations ownership.

## Stop conditions
Stop when interface contracts are unstable, security approval is missing, or failure semantics are undefined.