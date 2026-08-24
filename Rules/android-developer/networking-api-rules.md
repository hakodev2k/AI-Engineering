# Networking and API Rules

## Purpose
Make remote integrations resilient, bounded, compatible, and diagnosable.

## Scope
Applies to HTTP/RPC clients, serialization, retries, timeouts, pagination, and remote contracts.

## MUST
- Configure finite connection and operation timeouts appropriate to user and background flows.
- Validate and safely parse remote responses; unknown optional fields MUST NOT break compatible clients.
- Distinguish transport, protocol, authentication, rate-limit, validation, and server failures when behavior differs.
- Retry only operations that are safe or explicitly idempotent, using bounded backoff and jitter where appropriate.
- Preserve request correlation information without exposing secrets.

## MUST NOT
- Retry indefinitely or amplify an outage with unbounded concurrency.
- Log authorization headers, session tokens, or sensitive payloads.
- Assume HTTP success implies semantically valid data.

## SHOULD
- Design clients for backward-compatible server evolution.
- Centralize transport policy while keeping endpoint semantics explicit.
- Use contract/integration tests for critical APIs.

## Exceptions
Aggressive retry or long timeout policies require measured justification and operational review.

## Verification
Use integration/contract tests, fault injection, network inspection with redaction, timeout tests, and review of retry/idempotency behavior.