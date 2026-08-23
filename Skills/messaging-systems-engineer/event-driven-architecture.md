# Event-Driven Architecture

## Purpose
Design event-driven boundaries that reduce coupling without creating opaque distributed workflows.

## When to use
Use when services need asynchronous reaction, fan-out, temporal decoupling or independent scaling.

## Inputs
Domain boundaries, workflows, consistency needs, SLOs and ownership.

## Context to inspect
Existing synchronous dependencies, transaction boundaries, event ownership and operational maturity.

## Core knowledge
Events represent facts. Asynchrony improves decoupling but introduces eventual consistency, duplicate delivery, harder debugging and operational cost.

## Procedure
1. Identify business boundaries and facts.
2. Decide where asynchronous behavior adds value.
3. Define event ownership/contracts.
4. Model consistency and failure behavior.
5. Design idempotency, retries and observability.
6. Keep synchronous paths where immediate consistency is required.
7. Validate workflow operability.

## Decision points
Prefer synchronous calls for simple request/response invariants; use events for independent reactions and durable propagation.

## Common failure patterns
Eventing everything, events as RPC, shared mutable schemas and hidden orchestration.

## Verification
Walk through success, delay, duplicate, loss-prevention and dependency-failure scenarios.

## Expected output
An explicit event-driven design with justified boundaries.

## Stop conditions
Stop when ownership or consistency requirements remain ambiguous.