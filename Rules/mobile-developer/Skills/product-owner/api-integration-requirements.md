# API and Integration Requirements

## Purpose
Define product-level behavior and contracts for external or internal integrations without prescribing implementation unnecessarily.

## When to use
Use for third-party APIs, partner integrations, webhooks, shared services, imports/exports, and asynchronous workflows.

## Inputs
Business workflow, actors, external contract, data mapping, failure expectations, volumes, security requirements, and ownership boundaries.

## Context to inspect
Inspect source-of-truth ownership, API limits, authentication, retries, timeouts, duplicate delivery, ordering, data freshness, versioning, and support responsibility.

## Core knowledge
Integrations fail partially and independently. Product requirements must address user-visible behavior during delay, duplication, unavailability, incompatibility, and recovery.

## Procedure
1. Define the business outcome and source of truth.
2. Map exchanged data and ownership.
3. Define trigger, timing, and freshness expectations.
4. Clarify authorization and consent boundaries.
5. Specify duplicate and idempotency expectations.
6. Define timeout, unavailable, and partial-success behavior.
7. Clarify reconciliation and recovery needs.
8. Define version compatibility and change ownership.
9. Add observability and support requirements.
10. Validate end-to-end acceptance with both sides.

## Decision points
Use synchronous interaction when immediate response is essential; asynchronous behavior when resilience and decoupling matter more. Prefer explicit reconciliation for financially or operationally important data.

## Common failure patterns
Happy-path-only requirements, assuming exactly-once delivery, no ownership for contract changes, silent data loss, and exposing raw vendor failures directly to users.

## Verification
Failure scenarios, ownership, security, reconciliation, and user-visible behavior are testable and agreed across integration boundaries.

## Expected output
A product integration contract covering normal, degraded, and recovery behavior.

## Stop conditions
Escalate when external contracts are unavailable, data ownership is disputed, or security/compliance approval is missing.