# Payment Idempotency Rules

## Purpose
Prevent duplicate financial effects when requests, events, or callbacks are retried.

## Scope
Payment creation, capture, refund, reversal, payout, webhook processing, and internal command execution.

## MUST
- Financial write operations MUST support idempotent execution using a stable business idempotency key.
- Idempotency records MUST bind the key to the operation type, principal, and canonical request payload or equivalent request fingerprint.
- Replays with the same key and different material payload MUST be rejected or escalated.
- Stored idempotency outcomes MUST distinguish completed, failed, indeterminate, and in-progress states.
- Concurrent duplicate requests MUST converge on one financial effect.

## MUST NOT
- MUST NOT rely only on client retry discipline.
- MUST NOT delete idempotency state before the maximum realistic retry window unless replacement controls exist.
- MUST NOT return a newly generated result for a replayed successful operation.

## SHOULD
- Idempotency storage SHOULD be durable and scoped close to the financial write boundary.

## Exceptions
Exceptions require proof that duplicate execution cannot create financial or accounting impact.

## Verification
Run concurrent duplicate tests, payload-mismatch tests, restart tests, and replay tests across provider timeouts and webhook retries.