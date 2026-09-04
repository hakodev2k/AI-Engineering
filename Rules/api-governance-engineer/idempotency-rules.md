# Idempotency Rules

## Purpose
Prevent duplicate side effects when requests are retried because of network, client, or intermediary uncertainty.

## Scope
Applies to retriable create, command, payment-like, provisioning, and mutation operations.

## MUST
- Operations that can be retried after an ambiguous outcome MUST define whether they are idempotent.
- When idempotency keys are supported, key scope, retention period, conflict behavior, and response replay semantics MUST be documented.
- Repeated requests with the same idempotency key and equivalent payload MUST NOT create duplicate side effects within the guaranteed window.
- Payload mismatch under the same idempotency key MUST produce deterministic failure behavior.
- Idempotency storage and cleanup MUST be designed for concurrency and failure recovery.

## MUST NOT
- Clients MUST NOT be told to retry a non-idempotent operation blindly.
- Idempotency MUST NOT depend only on best-effort in-memory state when durable guarantees are promised.

## SHOULD
- Naturally idempotent resource identifiers SHOULD be preferred when they simplify duplicate prevention.
- Idempotency guarantees SHOULD be validated under concurrent duplicate submissions.

## Exceptions
Exceptions require documented ambiguity risk, compensating controls, client guidance, and approval.

## Verification
Run concurrent and repeated-request tests, failure-injection tests around commit boundaries, and storage inspection. Confirm exactly-once business effects where the contract promises them.