# Azure Functions Production Engineering

## Purpose
Operate event-driven and scheduled Azure Functions with correct scaling, retries, identity, failure handling, and observability.

## When to use
Use for serverless functions, triggers, background processing, event consumers, timers, and function reliability investigations.

## Inputs
Trigger type, event volume, execution duration, retry semantics, dependencies, hosting plan, concurrency requirements, and failure policy.

## Context to inspect
Inspect function app settings, hosting plan, trigger configuration, storage account, managed identity, networking, retries, poison/dead-letter handling, host settings, logs, and metrics.

## Core knowledge
Function execution is generally at-least-once for many event sources; handlers must tolerate duplicates. Scaling and concurrency differ by trigger and hosting model. Retry behavior must align with downstream idempotency and failure isolation.

## Procedure
1. Define event semantics and acceptable processing latency.
2. Determine idempotency strategy and duplicate handling.
3. Choose hosting model from duration, scale, networking, and cost needs.
4. Configure identity and dependency access.
5. Set trigger batching/concurrency deliberately.
6. Define bounded retries and poison/dead-letter handling.
7. Add correlation, structured logs, metrics, and dependency tracing.
8. Protect downstream services with concurrency limits and backoff.
9. Test duplicate delivery, poison messages, scale bursts, restarts, and dependency outages.
10. Document replay and operational recovery procedures.

## Decision points
Use serverless consumption when burst scaling and pay-per-use fit; choose premium/dedicated options for stronger warm capacity, networking, or execution requirements. Use queues/events rather than synchronous invocation for work that benefits from decoupling.

## Common failure patterns
Assuming exactly-once execution, infinite retries, non-idempotent side effects, shared secrets, excessive trigger concurrency, timer overlap, and no poison-message workflow.

## Verification
Replay duplicate events, inject dependency failures, verify bounded retry/dead-letter behavior, inspect traces, and load test expected burst rates.

## Expected output
A resilient function workload with explicit delivery semantics, scaling controls, failure recovery, and operational evidence.

## Stop conditions
Stop when business side effects cannot tolerate duplicate execution and no idempotency mechanism exists, or when required trigger guarantees are undefined.