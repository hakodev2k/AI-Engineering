# External Integrations and Callouts

## Purpose
Design resilient Salesforce integrations with explicit contracts, authentication, timeouts, retries, idempotency, and failure recovery.

## When to use
Use for REST/SOAP callouts, middleware integration, outbound commands, inbound APIs, and synchronization workflows.

## Inputs
API contract, auth method, rate limits, latency, data ownership, retry semantics, failure modes.

## Context to inspect
Named Credentials, External Credentials, Remote Site legacy config, Apex clients, middleware, integration user permissions, logs, correlation IDs.

## Core knowledge
Distributed calls fail independently of Salesforce transactions. Retries can duplicate side effects. Callouts have transaction limits and cannot be treated like local method calls.

## Procedure
1. Define system of record and direction of authority.
2. Specify request/response schemas and versioning.
3. Use managed credential facilities instead of secrets in code.
4. Set bounded timeouts and classify retryable errors.
5. Add idempotency/correlation identifiers.
6. Separate transport mapping from domain logic.
7. Use async execution where transaction constraints require it.
8. Persist enough failure evidence for replay or reconciliation.
9. Test timeout, malformed response, auth failure, rate limiting, duplicate delivery, and partial failure.

## Decision points
Use middleware when orchestration, transformation, monitoring, or multi-system coordination exceeds a simple point-to-point integration.

## Common failure patterns
Hard-coded secrets, unlimited retries, no idempotency, coupling to vendor payloads, synchronous fan-out, and silent deserialization failures.

## Verification
Run contract tests, failure injection, security review, replay checks, and production-like latency tests.

## Expected output
A versioned integration design with resilience, security, observability, and reconciliation behavior.

## Stop conditions
Stop when API ownership, authentication approval, or duplicate/compensation semantics are unresolved.