# Integration Architecture

## Purpose
Design reliable, evolvable interactions between systems while controlling coupling, latency, failure propagation, ownership, and data semantics.

## When to use
Use for API integration, messaging, eventing, batch exchange, partner connectivity, or legacy bridging.

## Inputs
Business workflows, system context, contracts, latency needs, consistency needs, ownership, volume, failure tolerance.

## Preconditions
Producers, consumers, sources of truth, and trust boundaries are identified.

## Context to inspect
Existing APIs/events, identity model, network path, schemas, retry behavior, SLAs, rate limits, batch windows, reconciliation needs.

## Core knowledge
Synchronous calls couple availability and latency. Asynchronous messaging improves temporal decoupling but introduces eventual consistency, duplication, ordering, observability, and operational complexity.

## Procedure
1. Define integration purpose and business semantics.
2. Identify authoritative owner of each datum or command.
3. Choose sync, async, batch, or hybrid based on workflow needs.
4. Define contracts and versioning strategy.
5. Specify timeout, retry, circuit breaking, idempotency, and rate limits.
6. Model duplicate, delayed, reordered, and missing messages.
7. Define authentication, authorization, and data protection.
8. Define observability and correlation.
9. Define reconciliation and manual recovery paths.
10. Validate dependency SLAs against end-to-end targets.

## Decision points
Use synchronous calls when immediate response is business-required and dependency availability is acceptable. Use asynchronous patterns when durable decoupling, buffering, or workflow independence provides clear value.

## Common failure patterns
Chatty APIs, retry storms, shared database integration, unclear event semantics, no idempotency, hidden dependency chains, no reconciliation.

## Verification
Failure scenarios are tested and end-to-end contracts, ownership, recovery, and observability are explicit.

## Expected output
Integration design with contracts, failure handling, and operational model.

## Stop conditions
Stop when source-of-truth ownership or security authority is unresolved.