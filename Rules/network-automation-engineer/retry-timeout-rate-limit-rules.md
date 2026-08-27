# Retry, Timeout, and Rate Limit Rules

## Purpose
Prevent automation from amplifying transient failures into control-plane overload or widespread change instability.

## Scope
API calls, device sessions, polling, retries, backoff, concurrency, and vendor/service quotas.

## MUST
- Network operations MUST define bounded connect, request, and overall workflow timeouts.
- Retries MUST be limited and restricted to operations whose replay semantics are understood.
- Retried mutations MUST be idempotent, deduplicated, or protected by state verification.
- Concurrency and request rates MUST respect device, controller, and external-service capacity.
- Systemic failure signals MUST reduce or halt automation rather than trigger synchronized retry storms.

## MUST NOT
- MUST NOT retry permanent validation, authorization, or unsupported-operation failures as if transient.
- MUST NOT use unbounded parallelism across production devices.
- MUST NOT hide repeated timeout/retry exhaustion behind a generic success state.

## SHOULD
- Backoff SHOULD include jitter for distributed workers.
- Rate limits SHOULD be configurable by platform and operation class.

## Exceptions
Aggressive retry settings require measured capacity evidence, bounded scope, operational monitoring, and rollback of the setting if error rates rise.

## Verification
Use fault injection for timeouts and throttling, inspect retry classifications, measure peak concurrency/request rates, and verify circuit-breaking or halt behavior under systemic failure.