# Dependency and Integration Rules

## Purpose
Control production risk from internal and external dependencies.

## Scope
Applies to databases, APIs, queues, third-party services, identity providers, storage, and shared infrastructure.

## MUST
- Critical dependencies MUST have documented ownership, timeout behavior, failure handling, capacity assumptions, and observability.
- Integration contracts MUST define expected errors, compatibility expectations, and retry or recovery semantics where relevant.
- Dependency changes with material production impact MUST be validated in a representative environment before broad rollout.
- Critical third-party dependencies MUST have an operational response for outage or degradation.

## MUST NOT
- MUST NOT treat dependency success as implicit when health cannot be observed.
- MUST NOT allow cascading retry or timeout policies to exceed end-to-end budgets.
- MUST NOT make breaking integration changes without coordinated compatibility planning.

## SHOULD
- Prefer loose coupling and graceful degradation for nonessential dependencies.
- Track dependency latency, errors, saturation, and quota usage.

## Exceptions
Exceptions require documented constraint, residual risk, compensating controls, and owner acceptance.

## Verification
Inspect dependency maps, client configuration, contract tests, failure tests, telemetry, quotas, and release evidence.
