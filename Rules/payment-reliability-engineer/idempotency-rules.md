# Payment Idempotency Rules

## Purpose
Prevent duplicate financial effects when requests are retried, replayed, or delivered more than once.

## Scope
Payment creation, authorization, capture, refund, payout, webhook handling, and other money-moving commands.

## MUST
- Every externally retryable money-moving operation MUST have a stable idempotency key or equivalent deduplication identity.
- Repeated execution with the same identity MUST return the original outcome or a safe equivalent without creating a second financial effect.
- Deduplication state MUST survive process restarts for the full replay window.
- Idempotency behavior MUST be tested under concurrent duplicate requests.

## MUST NOT
- MUST NOT use timestamps or random values generated per retry as deduplication identities.
- MUST NOT perform irreversible side effects before idempotency ownership is established.

## SHOULD
- Store the request fingerprint with the idempotency record to detect conflicting reuse.

## Exceptions
Any exception requires documented replay analysis, bounded risk, compensating controls, and approval.

## Verification
Use integration tests with duplicate and concurrent requests, inspect persistence records, and confirm only one external financial effect occurs.