# Payment API Design

## Purpose
Design stable payment APIs that make monetary intent, authorization, retries, errors, and asynchronous outcomes explicit.

## When to use
Use for internal or public APIs that create or mutate payment-related resources.

## Inputs
Consumers, payment workflows, provider capabilities, compatibility constraints, security requirements.

## Context to inspect
Existing API conventions, authentication, domain states, idempotency, webhook model, schemas, observability.

## Core knowledge
Payment APIs must distinguish accepted processing from completed money movement. Contracts should expose durable resource IDs, machine-actionable errors, explicit amounts/currencies, safe idempotency, and asynchronous state retrieval.

## Procedure
1. Identify consumer goals and trust boundary.
2. Define resource boundaries and lifecycle.
3. Represent money with integer minor units or exact decimal semantics plus ISO currency.
4. Define commands and retrieval separately.
5. Require idempotency for side-effecting operations.
6. Specify authorization and tenant ownership.
7. Define validation and invariant errors.
8. Model pending/unknown outcomes.
9. Define status codes and stable error codes.
10. Specify pagination/filtering for histories.
11. Add versioning and backward-compatibility rules.
12. Document webhook/polling completion semantics.
13. Add contract and integration tests.

## Decision points
Use synchronous completion only when the rail reliably completes within request bounds. Prefer asynchronous resources for external or multi-stage processing.

## Common failure patterns
Floating-point amounts, ambiguous success responses, leaking provider errors directly, non-idempotent POST retries, and breaking enum changes.

## Verification
Validate OpenAPI/schema contracts, authorization, replay behavior, error cases, pending flows, compatibility, and end-to-end provider mapping.

## Expected output
A stable API contract with explicit lifecycle, security, idempotency, errors, and asynchronous semantics.

## Stop conditions
Stop when business ownership, money representation, or irreversible operation semantics are undefined.