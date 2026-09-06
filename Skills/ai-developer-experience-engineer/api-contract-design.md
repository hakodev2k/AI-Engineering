# API Contract Design

## Purpose
Design stable, comprehensible AI platform APIs that developers can integrate correctly, evolve safely, and debug under production conditions.

## When to use
Use when creating or reviewing REST, RPC, streaming, batch, tool-calling, model-management, evaluation, or administration APIs.

## Inputs
User workflows, existing API conventions, schema definitions, error taxonomy, compatibility policy, authentication model, rate limits, latency targets, and operational constraints.

## Context to inspect
Inspect existing endpoint naming, versioning, pagination, request/response envelopes, streaming semantics, idempotency behavior, retries, SDK abstractions, documentation, and production incidents caused by contract ambiguity.

## Core knowledge
An API is a long-lived compatibility boundary. Good contracts make invalid states difficult to express, distinguish retryable from terminal failures, expose enough metadata for diagnosis, and avoid coupling consumers to internal implementation. AI APIs additionally need explicit model identity, usage accounting, truncation behavior, safety outcomes, and asynchronous/streaming semantics where relevant.

## Procedure
1. Identify consumers and concrete tasks.
2. Define resources, operations, and lifecycle states.
3. Specify required and optional inputs with validation rules.
4. Define outputs, metadata, pagination, streaming events, and termination semantics.
5. Design consistent error codes with retry guidance.
6. Decide idempotency behavior for state-changing operations.
7. Define timeouts, cancellation, quotas, and rate-limit signaling.
8. Review security and authorization boundaries.
9. Evaluate forward/backward compatibility.
10. Prototype the contract from a consumer perspective before implementation.
11. Add contract tests and examples.
12. Document migration behavior for future changes.

## Decision points
Prefer additive evolution over mutation. Use asynchronous jobs for long-running operations requiring durable status. Use streaming when partial output materially improves UX and consumers can handle incremental failure. Require idempotency keys when retries could duplicate costly or irreversible operations.

## Common failure patterns
Leaking internal enums, ambiguous nullability, unstable response shapes, HTTP 200 with embedded failures, undocumented limits, inconsistent errors, unsafe retries, missing model/version metadata, and silent truncation.

## Verification
Validate the schema mechanically, run contract tests, generate or exercise an SDK client, test malformed inputs, retry scenarios, cancellation, limits, and backward compatibility against representative existing clients.

## Expected output
A reviewed API contract, examples, error model, compatibility notes, and verification evidence.

## Stop conditions
Escalate when ownership of compatibility is unclear, a breaking change lacks migration approval, authorization boundaries are unresolved, or the operation can produce irreversible effects without defined idempotency.