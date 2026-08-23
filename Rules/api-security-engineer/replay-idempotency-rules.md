# Replay and Idempotency Security Rules

## Purpose
Prevent replayed or duplicated API requests from causing unauthorized repeated effects.

## Scope
Payments, provisioning, state changes, signed requests, retries, and high-impact commands.

## MUST
- Identify operations where replay or duplicate execution creates security or financial impact.
- Use idempotency keys, nonces, timestamps, sequence controls, or equivalent protections appropriate to the protocol.
- Bind replay-prevention data to the relevant identity and operation context.
- Define retention and collision behavior for idempotency records.

## MUST NOT
- Assume transport encryption alone prevents replay.
- Retry non-idempotent high-impact operations blindly after ambiguous failures.

## SHOULD
- Design critical state-changing APIs with explicit duplicate-request semantics.

## Exceptions
Operations proven naturally idempotent may omit extra replay state when the proof and assumptions are documented.

## Verification
Test duplicate, delayed, reordered, concurrent, and retried requests; inspect persistence and race-condition behavior.