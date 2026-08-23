# Idempotent Consumers

## Purpose
Make repeated delivery safe so retries and redelivery do not duplicate business effects.

## When to use
Use whenever at-least-once delivery can reach non-idempotent logic.

## Inputs
Message identity, business keys, state store, transaction capabilities and side effects.

## Context to inspect
Consumer transaction boundaries, duplicate windows, retention period and external calls.

## Core knowledge
Idempotency may be implemented through natural business invariants, processed-message records, conditional writes or idempotency keys.

## Procedure
1. Identify duplicate-sensitive effects.
2. Define stable message/business identity.
3. Choose deduplication scope and retention.
4. Make duplicate detection atomic with local effects where possible.
5. Handle concurrent duplicates.
6. Define behavior after retention expiry.
7. Test repeated and concurrent delivery.

## Decision points
Prefer natural idempotency over growing deduplication tables; use durable keys when effects cannot naturally converge.

## Common failure patterns
In-memory deduplication, check-then-write races, unstable IDs and marking processed before effects commit.

## Verification
Replay identical messages concurrently and after crashes; verify one logical outcome.

## Expected output
A consumer with explicit duplicate guarantees and tests.

## Stop conditions
Escalate when required atomicity spans systems without a safe coordination strategy.