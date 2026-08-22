# Serverless Architecture

## Purpose
Design event-driven and request-driven workloads using managed serverless compute without creating hidden reliability or cost problems.

## When to use
Use for bursty APIs, event processing, scheduled tasks, integrations, and low-operations workloads.

## Inputs
Invocation patterns, execution duration, latency target, event sources, concurrency, state needs, cost profile.

## Context to inspect
Functions, triggers, queues, API gateways, identities, networking, retry policies, dead-letter handling, quotas.

## Core knowledge
Serverless shifts server management to the provider but retains distributed-systems concerns: retries, duplicate delivery, cold starts, concurrency, quotas, observability, and downstream pressure.

## Procedure
1. Validate workload fit against runtime and execution limits.
2. Define event contracts and idempotency strategy.
3. Bound concurrency to protect dependencies.
4. Configure timeouts, retries, poison handling, and DLQs.
5. Minimize cold-start-sensitive dependencies.
6. Use managed identity and least privilege.
7. Externalize durable state.
8. Instrument invocation, latency, errors, throttling, and cost.
9. Load-test burst behavior.
10. Document replay and recovery.

## Decision points
Choose serverless when elasticity and operational simplicity outweigh runtime constraints. Prefer long-running services for steady heavy workloads or specialized runtime control.

## Common failure patterns
Unbounded fan-out, non-idempotent handlers, retry storms, hidden NAT cost, oversized packages, and no replay process.

## Verification
Replay duplicate events, test throttling and dependency failure, and measure cold/warm latency and cost.

## Expected output
A resilient serverless workload with bounded failure behavior.

## Stop conditions
Escalate when execution limits, compliance, networking, or cost make the platform unsuitable.