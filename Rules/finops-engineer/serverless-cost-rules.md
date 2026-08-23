# Serverless Cost Rules

## Purpose
Manage consumption-based services where cost scales with invocations, duration, memory, throughput, and downstream usage.

## Scope
Functions, serverless containers, managed event processing, API gateways, workflow engines, and consumption databases.

## MUST
- Identify billable dimensions and model how they scale with traffic and failure behavior.
- Monitor invocation volume, duration, memory, concurrency, retries, and downstream calls where material.
- Bound retry storms, runaway triggers, and recursive event patterns through technical controls.
- Validate cost and latency effects after memory, concurrency, or timeout tuning.

## MUST NOT
- Assume serverless is cheaper solely because idle infrastructure is absent.
- Ignore duplicate events, retries, cold-start mitigation, logging, or downstream charges.
- Increase concurrency without assessing dependent-system capacity and cost.

## SHOULD
- Use unit cost per successful business operation for high-volume workloads.

## Exceptions
Low-volume workloads may use simplified modeling when maximum financial exposure is demonstrably bounded.

## Verification
Inspect provider billing dimensions, telemetry, retry/error rates, concurrency controls, unit-cost trends, and load-test evidence.