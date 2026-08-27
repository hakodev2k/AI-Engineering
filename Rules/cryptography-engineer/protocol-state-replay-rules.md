# Protocol State and Replay Rules

## Purpose
Prevent valid cryptographic messages from being misused outside their intended state or time.

## Scope
Challenges, sessions, counters, timestamps, sequence numbers, tokens, and signed/encrypted messages.

## MUST
- Define freshness, ordering, duplication, and replay semantics for security-sensitive messages.
- Bind cryptographic messages to the intended protocol, peer, session, operation, and context where required.
- Reject invalid state transitions before security-sensitive effects occur.

## MUST NOT
- Assume encryption or signatures inherently prevent replay.
- Rely on wall-clock timestamps alone where clock manipulation or skew defeats the security property.

## SHOULD
- Prefer explicit nonces, sequence numbers, or one-time identifiers with bounded retention.

## Exceptions
Replay-tolerant operations require documented idempotency and impact analysis.

## Verification
Run replay, reorder, duplicate, stale-message, cross-session, and state-transition tests.