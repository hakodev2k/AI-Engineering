# Failure Recovery Rules

## Purpose
Contain failures and restore realtime sessions predictably.

## Scope
Reconnect, ICE restart, signaling loss, media-server failure, regional failure, and partial degradation.

## MUST
- Each recoverable failure class MUST have bounded retry, backoff, and terminal behavior.
- Recovery MUST distinguish transient transport failure from authorization or protocol failure.
- Session restoration MUST prevent duplicate publishers, subscriptions, or stale state.
- Regional/server failure behavior MUST be tested before relying on it operationally.

## MUST NOT
- MUST NOT retry authentication failures indefinitely.
- MUST NOT hide repeated recovery loops from telemetry.
- MUST NOT sacrifice all active sessions to recover a single failed dependency.

## SHOULD
- Prefer graceful media degradation over full teardown when correctness and security permit.

## Exceptions
Nonrecoverable session types require explicit user-facing failure semantics.

## Verification
Use fault injection, reconnect tests, server termination tests, state audits, and recovery-time metrics.