# Dependency Readiness Rules
## Purpose
Control production risk introduced by internal and external dependencies.
## Scope
Services, APIs, libraries, databases, identity providers, queues, infrastructure services, and SaaS dependencies.
## MUST
- Critical dependencies MUST have documented ownership, contract expectations, failure behavior, and escalation paths.
- Timeout, retry, circuit-breaking, backpressure, or equivalent protections MUST be evaluated where relevant.
- Rate limits, quotas, maintenance windows, and availability commitments MUST be included in readiness analysis.
- Breaking dependency changes MUST be validated against consumers and rollout ordering.
- Critical third-party dependencies MUST have a degradation or recovery strategy.
## MUST NOT
- Infinite retries or unbounded waiting MUST NOT be used.
- Test-environment success MUST NOT be treated as evidence of production capacity.
- Unsupported dependency behavior MUST NOT be relied on without accepted risk.
## SHOULD
- Prefer contract tests and controlled failure testing.
- Minimize correlated failure where feasible.
## Exceptions
Unmitigated dependency risks require named ownership, contingency planning, and approval.
## Verification
Inspect contracts, integration tests, timeout/retry config, quota data, runbooks, and failure evidence.