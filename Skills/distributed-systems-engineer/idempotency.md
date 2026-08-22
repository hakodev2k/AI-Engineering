# Idempotency

## Purpose
Make repeated execution safe when networks, clients, workers, or brokers can retry operations.

## When to use
Use for payment-like commands, resource creation, webhooks, message consumers, scheduled jobs, and any operation that may be delivered more than once.

## Inputs
Operation contract, uniqueness keys, persistence model, retry behavior, retention requirements, and concurrency expectations.

## Context to inspect
Inspect callers, brokers, HTTP retry layers, database constraints, existing request identifiers, side effects, and downstream operations.

## Core knowledge
Exactly-once delivery is rarely an end-to-end guarantee. Practical systems combine at-least-once delivery with idempotent processing, durable deduplication, or naturally idempotent state transitions.

## Procedure
1. Identify duplicate-delivery paths.
2. Define the semantic identity of one business operation.
3. Choose an idempotency key controlled by the correct boundary.
4. Persist key, status, and result atomically with the protected side effect when possible.
5. Define behavior for in-progress, completed, expired, and conflicting requests.
6. Protect against concurrent duplicates using constraints or transactional coordination.
7. Define retention and cleanup policy.
8. Test retries before, during, and after commit.

## Decision points
Use natural idempotency for state-setting operations when sufficient. Use durable deduplication when side effects cannot safely repeat. Avoid in-memory-only keys for multi-instance durable workflows.

## Common failure patterns
Deduplicating only by payload hash, recording the key after the side effect, losing results needed for replay, and ignoring concurrent duplicates.

## Verification
Send identical requests concurrently and after simulated timeouts. Confirm one logical side effect occurs and repeated callers receive deterministic results.

## Expected output
A durable idempotency contract with concurrency-safe implementation and retention policy.

## Stop conditions
Escalate when no stable operation identity exists or a downstream non-idempotent side effect cannot be coordinated or compensated.