# Integration Design

## Purpose
Design reliable boundaries between the proposed solution and existing APIs, identity systems, data stores, event systems, and operational tooling.

## When to use
Use whenever solution value depends on external systems or cross-team interfaces.

## Inputs
API contracts, protocols, schemas, authentication methods, traffic patterns, failure expectations, ownership.

## Context to inspect
Versioning, quotas, timeouts, retries, idempotency, data semantics, network paths, credentials, monitoring, and support ownership.

## Core knowledge
Integration failures arise at boundaries: incompatible semantics, partial failure, duplicate delivery, schema drift, authorization, and hidden rate limits. Resilience must match interaction semantics.

## Procedure
1. Inventory integration points and owners.
2. Define contracts and data semantics.
3. Map authentication and authorization.
4. Define timeout, retry, idempotency, and backpressure behavior.
5. Address versioning and compatibility.
6. Model dependency failures and degraded modes.
7. Define observability and support boundaries.
8. Validate with representative integration tests.

## Decision points
Use synchronous calls for immediate request/response semantics; prefer asynchronous patterns when decoupling, buffering, or independent availability matters.

## Common failure patterns
Blind retries, shared credentials, undocumented transformations, no idempotency, and assuming external availability equals local availability.

## Verification
Contracts, failure scenarios, authorization, and representative end-to-end flows are tested.

## Expected output
An integration design with contracts, resilience behavior, and ownership.

## Stop conditions
Stop when external contracts, permissions, or ownership cannot be established.