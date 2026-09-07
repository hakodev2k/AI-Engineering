# Idempotency and Deduplication Rules

## Purpose
Prevent duplicate effects under retries, redelivery, timeout ambiguity, and failover.

## Scope
Database writes, commands, event consumers, imports, and repair workflows.

## MUST
- Operations subject to retry or redelivery MUST define duplicate-handling semantics.
- Idempotency keys MUST be scoped to the logical operation and retained for the required retry horizon.
- Deduplication state updates MUST be atomic with protected side effects where correctness requires it.
- Ambiguous timeout outcomes MUST be resolved by querying durable state or a safe retry protocol.

## MUST NOT
- MUST NOT assume exactly-once network delivery.
- MUST NOT use non-unique timestamps as sole deduplication identifiers.
- MUST NOT retry non-idempotent mutations blindly.

## SHOULD
- Business-natural identifiers SHOULD be preferred when they safely encode operation identity.

## Exceptions
At-least-once side effects require explicit tolerance and reconciliation.

## Verification
Run duplicate-delivery tests, timeout injection, concurrent retry tests, and inspect durable deduplication records.