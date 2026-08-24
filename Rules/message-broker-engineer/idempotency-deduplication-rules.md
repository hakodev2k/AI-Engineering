# Idempotency and Deduplication

## Purpose
Prevent duplicate delivery from producing duplicate business effects.

## Scope
Consumer processing, producer retries, deduplication keys, and side effects.

## MUST
- Duplicate-sensitive operations MUST use a stable idempotency identity.
- Deduplication state MUST have retention sufficient for the realistic redelivery window.
- Side effects MUST be ordered so retries cannot silently repeat irreversible actions.

## MUST NOT
- MUST NOT use volatile process memory as the sole deduplication store for durable workflows.
- MUST NOT assume message IDs are unique unless the contract guarantees it.

## SHOULD
- Prefer naturally idempotent state transitions when possible.

## Exceptions
Document duplicate impact, compensating control, evidence, and approval.

## Verification
Replay identical messages, inject producer retries, and inspect resulting durable state.