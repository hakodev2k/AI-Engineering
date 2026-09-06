# Integration and Dependency Planning

## Purpose
Plan the application, identity, data, API, workflow, and operational dependencies required to move an AI capability from prototype into reliable daily use.

## When to use
Use after a promising pilot design exists and before committing to production delivery dates.

## Inputs
Target workflow, system architecture, APIs, identity model, data sources, model/provider choices, service levels, and ownership map.

## Context to inspect
Inspect integration contracts, rate limits, authentication, network boundaries, webhooks, queues, batch jobs, retries, timeouts, dependency SLAs, and maintenance windows.

## Core knowledge
Adoption fails when an AI feature is technically impressive but disconnected from the systems where work is actually completed. Senior planning treats dependency behavior, permissions, and failure recovery as part of the product experience.

## Procedure
1. Map every external system required by the target workflow.
2. Define read, write, and action permissions for each integration.
3. Review API stability, quotas, latency, and error behavior.
4. Identify sync versus async interactions.
5. Define timeout, retry, idempotency, and fallback behavior.
6. Confirm identity propagation and authorization boundaries.
7. Establish ownership for dependency incidents.
8. Identify sandbox, test-data, and environment requirements.
9. Sequence dependencies on the delivery plan.
10. Validate failure scenarios before rollout.

## Decision points
Use synchronous calls only where the user requires immediate completion and dependency latency is acceptable. Prefer asynchronous processing for long-running or failure-prone actions. Avoid direct writes where approval or transactional safeguards are required.

## Common failure patterns
Ignoring rate limits, retrying non-idempotent actions, sharing service credentials broadly, building against unstable APIs, and lacking a degraded-mode experience.

## Verification
Run integration tests for success, timeout, rate-limit, authorization failure, duplicate delivery, and dependency outage scenarios.

## Expected output
An integration dependency map with contracts, permissions, resilience behavior, owners, test requirements, and rollout sequencing.

## Stop conditions
Stop when a critical dependency lacks a stable contract, required permissions cannot be approved, or safe failure behavior cannot be defined.