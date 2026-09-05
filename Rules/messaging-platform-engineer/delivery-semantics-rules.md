# Delivery Semantics Rules

## Purpose
Make delivery guarantees explicit so business logic does not rely on assumptions the platform cannot provide.

## Scope
At-most-once, at-least-once, effectively-once, and transactional delivery behavior.

## MUST
- Each message flow MUST document its intended delivery semantics and duplicate/failure behavior.
- At-least-once flows MUST assume duplicates can occur.
- Side-effecting consumers MUST implement idempotency or an equivalent duplicate-safe design where duplicates are possible.
- Delivery claims MUST be supported by broker and application configuration evidence.

## MUST NOT
- MUST NOT describe a flow as exactly-once when external side effects are not covered by the guarantee.
- MUST NOT acknowledge a message before required durable processing when that can lose work.

## SHOULD
- Prefer simple at-least-once delivery plus explicit idempotency over fragile implicit guarantees.

## Exceptions
Alternative semantics require documented business impact and verification.

## Verification
Review broker settings, acknowledgement code, failure tests, duplicate tests, and transaction boundaries.