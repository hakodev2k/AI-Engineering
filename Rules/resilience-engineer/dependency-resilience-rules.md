# Dependency Resilience Rules

## Purpose
Prevent downstream and upstream dependency failures from causing uncontrolled system-wide outages.

## Scope
Applies to synchronous APIs, databases, queues, identity providers, DNS, storage, third-party services, and internal platform dependencies.

## MUST
- Every critical dependency MUST have documented timeout, failure, saturation, and recovery behavior.
- Callers MUST bound waits with timeouts aligned to the end-to-end latency budget.
- Dependency failures MUST be isolated using appropriate concurrency limits, circuit breaking, load shedding, fallback, or queueing mechanisms.
- Critical third-party dependencies MUST have an explicit contingency strategy proportional to business impact.
- Dependency health MUST be observable independently from caller health.

## MUST NOT
- MUST NOT retry indefinitely or without a bounded policy.
- MUST NOT let one degraded dependency consume all request threads, connections, workers, or other shared resources.
- MUST NOT treat a successful TCP connection or generic health endpoint as proof that a dependency can serve the required operation.

## SHOULD
- Systems SHOULD degrade nonessential features before failing critical paths.
- Dependency contracts SHOULD define rate limits, availability expectations, idempotency characteristics, and error semantics.

## Exceptions
A dependency without isolation or fallback requires documented justification, blast-radius analysis, recovery procedure, and approval by the service owner.

## Verification
Use dependency maps, configuration inspection, integration tests, fault injection, saturation tests, traces, and incident evidence. Confirm failures remain bounded and recovery occurs without manual resource cleanup.