# Idempotency and Deduplication

## Purpose
Prevent duplicate workflow executions or retries from creating duplicate business effects.

## When to use
Use for payments, tickets, emails, provisioning, record creation, external writes, webhooks, queue consumers, and any at-least-once delivery path.

## Inputs
Business operation, event identifiers, target-system idempotency features, retention window, retry behavior, and concurrency profile.

## Context to inspect
Inspect source delivery guarantees, unique business keys, existing records, target API semantics, database constraints, and race conditions.

## Core knowledge
Execution-level deduplication is not enough when the business effect can be triggered through multiple routes. Strong idempotency ties a stable operation key to the intended side effect and records completion durably.

## Procedure
1. Identify every side effect that must occur at most once.
2. Choose a stable idempotency key derived from the business operation, not runtime attempt ID.
3. Determine the deduplication retention period.
4. Use target-native idempotency keys where trustworthy.
5. Otherwise persist operation keys with atomic uniqueness guarantees.
6. Define behavior for in-progress, completed, failed, and expired keys.
7. Handle concurrent duplicate requests safely.
8. Return or reconstruct the prior successful result when appropriate.
9. Make retry logic reuse the same key.
10. Test duplicate, concurrent, timeout-after-commit, and replay scenarios.

## Decision points
Prefer database uniqueness or target-native atomic idempotency over read-then-write checks. Use content hashes only when semantically identical payloads truly represent the same business operation.

## Common failure patterns
Generating a new key on each retry, deduplicating only in memory, checking existence before a non-atomic write, and expiring keys before upstream replay windows end.

## Verification
Run concurrent duplicates and simulate network timeout after the external side effect. Confirm one business effect and a deterministic response to later retries.

## Expected output
An idempotency design with stable keys, durable state, retention, concurrency behavior, and tests.

## Stop conditions
Stop when no stable business identity exists and duplicate side effects are irreversible or financially/security sensitive without another safe control.