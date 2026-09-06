# Idempotency and Request Safety

## Purpose
Prevent duplicate side effects when clients retry or networks produce ambiguous outcomes.

## When to use
Use for payment-like operations, provisioning, job submission, webhook ingestion, and other mutation APIs exposed to retries.

## Inputs
Operation semantics, request identity, persistence options, retry behavior, consistency requirements.

## Context to inspect
Inspect transaction boundaries, existing uniqueness constraints, client retry policies, and duplicate incident history.

## Core knowledge
An idempotency key represents a logical operation, not merely an HTTP request. Correct implementations bind keys to normalized request intent, persist outcomes atomically with effects when possible, and define retention and concurrency behavior.

## Procedure
1. Identify operations vulnerable to duplicate execution.
2. Define idempotency-key scope and ownership.
3. Validate key format and bind it to request identity/payload fingerprint.
4. Choose durable storage and retention period.
5. Ensure concurrent duplicate requests serialize or converge safely.
6. Persist operation status and replayable response.
7. Handle in-progress, completed, failed, and expired keys explicitly.
8. Prevent key reuse for different operations.
9. Test crashes around side-effect boundaries.
10. Document client retry semantics.

## Decision points
Use database uniqueness/transactions when side effects share the same datastore; use workflow/outbox patterns for distributed effects.

## Common failure patterns
Caching keys only in memory, writing idempotency records after effects, accepting key reuse, and treating every failure as safe to retry.

## Verification
Run duplicate, concurrent, timeout, crash-recovery, and key-reuse tests; verify exactly one logical side effect.

## Expected output
Retry-safe mutation semantics with deterministic duplicate handling.

## Stop conditions
Escalate when atomicity across irreversible external side effects cannot be guaranteed or compensated.