# Integration and API Architecture

## Purpose
Design stable integration boundaries between AI components, enterprise services, external providers, and user-facing applications.

## When to use
Use whenever an AI solution depends on existing APIs, events, webhooks, tools, databases, or third-party services.

## Inputs
System inventory, API contracts, event schemas, ownership, availability targets, throughput, data sensitivity, and integration constraints.

## Context to inspect
Inspect current interfaces, authentication patterns, quotas, timeouts, retry behavior, versioning, error contracts, idempotency support, and dependency SLOs.

## Core knowledge
AI orchestration should not hide weak integration design. Stable typed boundaries, explicit failure semantics, time budgets, and dependency isolation make probabilistic components operable.

## Procedure
1. Map all upstream and downstream dependencies.
2. Identify synchronous versus asynchronous interactions.
3. Define request, response, and event contracts.
4. Specify timeouts, retries, backoff, and idempotency behavior.
5. Budget end-to-end latency across dependencies.
6. Define error normalization and partial-failure handling.
7. Add rate limiting and backpressure where needed.
8. Plan contract and provider version changes.
9. Instrument dependency latency and failures.
10. Test degraded and unavailable dependency scenarios.

## Decision points
Use synchronous calls when the caller needs an immediate bounded result; use messaging for long-running, bursty, or loosely coupled work. Cache only where staleness is acceptable and invalidation is understood.

## Common failure patterns
Retry storms, no timeout budget, leaking provider-specific contracts throughout the application, non-idempotent retries, and coupling model prompts directly to unstable APIs.

## Verification
Contract tests, failure-injection tests, latency measurements, and dependency dashboards demonstrate expected behavior.

## Expected output
An integration architecture with contracts, dependency policies, resilience behavior, and versioning strategy.

## Stop conditions
Stop when required interfaces have no stable owner, dependency limits cannot meet NFRs, or failure semantics remain undefined.