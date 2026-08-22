# GraphQL Error Handling

## Purpose
Design predictable error semantics that help clients recover while preventing sensitive implementation details from leaking.

## When to use
Use when defining resolver failures, mutation outcomes, validation errors, partial results, or dependency failures.

## Inputs
Schema nullability, domain error taxonomy, client expectations, logging standards, and security requirements.

## Context to inspect
Inspect current error extensions, HTTP behavior, mutation payloads, null propagation, exception middleware, tracing, and client retry logic.

## Core knowledge
GraphQL can return data and errors together. Nullability controls propagation when a resolver fails. Expected business outcomes should be modeled intentionally rather than converted blindly into internal errors.

## Procedure
1. Classify failures as validation, authorization, business conflict, not-found, dependency, transient, or internal.
2. Decide which failures belong in schema payloads versus GraphQL errors.
3. Define stable machine-readable error codes.
4. Sanitize messages and extensions.
5. Preserve correlation identifiers for support.
6. Respect nullability and partial-result semantics.
7. Mark retryability only when safe.
8. Log server-side root causes separately from client-facing messages.
9. Test nested resolver failures and mutation conflicts.
10. Document error contracts for consumers.

## Decision points
Use typed mutation result payloads when business outcomes are expected and actionable. Use GraphQL errors for execution, authorization, and unexpected failures according to platform conventions.

## Common failure patterns
Returning stack traces, using free-text messages as client contracts, converting every failure to HTTP 500, hiding partial failure, unstable error codes, and retrying non-idempotent mutations blindly.

## Verification
Verify client-visible shape, server logs, null propagation, correlation, and absence of secrets for each failure class.

## Expected output
Stable error semantics that separate client contracts from internal diagnostics.

## Stop conditions
Stop when required error behavior conflicts with security policy or schema nullability cannot support the intended semantics without a breaking change.