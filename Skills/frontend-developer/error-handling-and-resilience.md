# Error Handling and Resilience

## Purpose
Design frontend failure behavior that preserves user intent, distinguishes recoverable conditions, avoids retry storms, and provides useful diagnostics.

## When to use
Use for network failures, rendering exceptions, unavailable dependencies, partial data, mutation failures, or application-wide error handling.

## Inputs
API error contracts, UX requirements, failure telemetry, retry semantics, offline expectations, and application architecture.

## Context to inspect
Global error boundaries/handlers, request interceptors, retry policies, loading states, toast systems, logs, correlation IDs, and mutation flows.

## Core knowledge
Failures differ by scope and recoverability. Users need actionable recovery, while engineers need structured context. Automatic retries are safe only for appropriate transient/idempotent operations and must be bounded.

## Procedure
1. Classify expected failure modes by boundary.
2. Decide which failures can be handled locally versus globally.
3. Preserve user input and navigation state where recovery is possible.
4. Map known server errors to specific actionable feedback.
5. Use bounded retries with backoff only for eligible failures.
6. Provide fallback UI for isolated rendering failures.
7. Include correlation/context in telemetry without leaking sensitive data.
8. Define offline or degraded behavior when required.
9. Test partial failure and recovery paths.
10. Confirm failures do not create duplicate mutations or infinite loops.

## Decision points
Retry reads more readily than non-idempotent writes. Use local error UI when recovery is scoped to a feature; use application-level fallback when continuing would be unsafe or impossible.

## Common failure patterns
Generic error toasts, swallowed exceptions, infinite retry loops, losing form input, duplicate writes, logging secrets, and treating authorization errors as transient network failures.

## Verification
Injected failures produce intended UI, retries remain bounded, user state survives recoverable errors, duplicate side effects do not occur, and telemetry contains actionable context.

## Expected output
A failure-handling model with recovery behavior, retry rules, user messaging, and diagnostic evidence.

## Stop conditions
Escalate when API side-effect/idempotency semantics are unknown, sensitive telemetry requirements are unclear, or degraded behavior could cause unsafe business actions.