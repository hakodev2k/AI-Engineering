# Retry and Backoff Rules

## Purpose
Make retries bounded, safe, and evidence-driven so transient failures do not become amplification events.

## Scope
Applies to model calls, tools, APIs, queues, databases, and inter-agent communication.

## MUST
- Retries MUST be limited by attempt and elapsed-time budgets.
- Retry eligibility MUST depend on classified failure type.
- Backoff MUST include jitter for shared dependencies where synchronized retry storms are possible.
- Side-effecting operations MUST satisfy idempotency requirements before automatic retry.
- Retry exhaustion MUST surface the original failure context and final retry state.

## MUST NOT
- Authentication, authorization, validation, or deterministic contract failures MUST NOT be blindly retried.
- Nested components MUST NOT multiply retries without an explicit end-to-end budget.
- Retries MUST NOT conceal sustained dependency degradation.

## SHOULD
- Retry policy SHOULD consider dependency rate-limit signals and server-provided retry hints.
- Critical paths SHOULD expose retry counters and exhaustion metrics.

## Exceptions
Exceptions require dependency-specific evidence, bounded risk, and verification under failure simulation.

## Verification
Inspect retry configuration, failure classification tests, rate-limit tests, timeout tests, traces, and load tests that simulate shared dependency failure.