# Signaling Protocol Rules

## Purpose
Protect correctness and interoperability of session signaling.

## Scope
Offer/answer exchanges, session state, negotiation messages, and signaling transports.

## MUST
- Signaling state transitions MUST be explicit and validated before mutation.
- Messages MUST carry correlation/session identifiers sufficient to reject stale or misrouted updates.
- Protocol errors MUST preserve diagnostic context without exposing sensitive payloads.
- Compatibility changes MUST be tested against supported client versions.

## MUST NOT
- MUST NOT accept impossible state transitions silently.
- MUST NOT assume signaling message ordering unless the transport contract guarantees it.
- MUST NOT make breaking schema changes without an approved compatibility plan.

## SHOULD
- Signaling handlers SHOULD be idempotent where retries are possible.
- Schemas SHOULD be versioned or evolution-safe.

## Exceptions
Exceptions require documented interoperability evidence, risk, rollback, and reviewer approval.

## Verification
Use protocol conformance tests, state-machine tests, packet/message traces, compatibility tests, and code review.