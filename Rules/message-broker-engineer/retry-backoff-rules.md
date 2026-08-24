# Retry and Backoff

## Purpose
Recover transient failures without amplifying incidents.

## Scope
Producer retries, consumer retries, retry topics, backoff, and jitter.

## MUST
- Retries MUST be bounded by attempt count, elapsed time, or both.
- Retry policy MUST distinguish transient from permanent failures.
- Backoff MUST prevent synchronized retry storms for shared dependencies.

## MUST NOT
- MUST NOT retry validation, authorization, or deterministic contract failures indefinitely.
- MUST NOT hide repeated failures behind unlimited automatic retries.

## SHOULD
- Use exponential backoff with jitter where contention or outage amplification is possible.

## Exceptions
Document failure class, capacity impact, observability, and approval.

## Verification
Inject dependency failures and confirm attempt bounds, delays, metrics, and terminal handling.