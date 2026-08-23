# Robot Middleware and Message Contracts

## Purpose
Design stable, observable communication contracts between robot components so distributed behavior remains interoperable and diagnosable.

## When to use
Use when defining ROS or equivalent topics, services, actions, events, shared messages, or when integration failures arise from mismatched semantics.

## Inputs
Component responsibilities, data schemas, rates, latency needs, reliability needs, ownership, versioning constraints.

## Preconditions
Subsystem boundaries and data ownership are known.

## Context to inspect
Existing schemas, QoS, serialization, topic/service names, action lifecycles, retries, queue depth, timestamps, frame IDs, compatibility rules.

## Core knowledge
A transport is not a contract. Contracts must define units, coordinate frames, freshness, optionality, ordering, idempotency, failure semantics, and evolution strategy.

## Procedure
1. Identify producer and consumers for each exchange.
2. Define semantic meaning before field layout.
3. Specify units, frames, timestamps, valid ranges, and nullability.
4. Choose publish/subscribe, request/response, or long-running action semantics appropriately.
5. Define QoS, queue depth, deadline, durability, and reliability.
6. Specify cancellation, timeout, retry, and idempotency behavior.
7. Establish backward/forward compatibility rules.
8. Add schema validation and runtime diagnostics.
9. Test slow consumers, restarts, drops, duplicates, and version skew.
10. Document ownership and deprecation process.

## Decision points
Prefer asynchronous topics for streams, services for bounded requests, and actions for cancellable progress-bearing work. Reliable delivery is not always safer than fresh best-effort data.

## Common failure patterns
Implicit units, missing timestamps, oversized queues hiding stale data, schema reuse for unrelated semantics, infinite retries, and breaking field changes.

## Verification
Exercise compatibility tests, timing/freshness checks, restart scenarios, malformed messages, and degraded network conditions.

## Expected output
Versioned message contracts, QoS rules, integration tests, and ownership/deprecation guidance.

## Stop conditions
Stop when semantic ownership is unresolved or required delivery guarantees conflict with real-time/safety constraints.