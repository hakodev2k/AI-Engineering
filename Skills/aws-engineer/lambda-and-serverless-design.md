# Lambda and Serverless Design

## Purpose
Design reliable AWS Lambda workloads with correct event semantics, concurrency controls, observability, and cost discipline.

## When to use
Use for event-driven processing, APIs, automation, schedulers, or bursty workloads that fit Lambda execution constraints.

## Inputs
Event source, payload, concurrency, timeout, latency target, retry semantics, downstream limits, runtime, network requirements.

## Context to inspect
Function configuration, event-source mapping, DLQ/destinations, IAM role, VPC attachment, reserved/provisioned concurrency, logs/traces.

## Core knowledge
Lambda is at-least-once for many integrations; idempotency matters. Concurrency can amplify downstream load. VPC attachment, cold starts, package size, and initialization affect latency.

## Procedure
1. Define event contract and delivery semantics.
2. Decide synchronous vs asynchronous invocation.
3. Set timeout below caller/downstream limits.
4. Implement idempotency for retried events.
5. Configure retries, DLQ or failure destination.
6. Bound concurrency to protect dependencies.
7. Minimize initialization work and package size.
8. Use VPC only when private-network access is required.
9. Add structured logs, metrics, traces, and correlation IDs.
10. Load-test burst behavior and failure handling.

## Decision points
Use provisioned concurrency for predictable low-latency paths; reserved concurrency for isolation/protection. Prefer managed event sources over polling code.

## Common failure patterns
Unbounded concurrency, duplicate side effects, hidden retry storms, giant deployment packages, long synchronous chains, and missing DLQs.

## Verification
Inject duplicates/failures, observe retries, confirm downstream protection, and measure p95/p99 latency.

## Expected output
Function design, event semantics, concurrency policy, and test evidence.

## Stop conditions
Escalate when workload duration/state exceeds Lambda suitability or downstream systems cannot tolerate retry/concurrency behavior.