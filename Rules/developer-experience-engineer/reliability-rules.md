# Tooling Reliability Rules
## Purpose
Keep shared developer services and tools dependable under normal and degraded conditions.
## Scope
Developer portals, build services, caches, package proxies, CI services, and shared automation.
## MUST
- Critical services MUST define ownership, dependency boundaries, failure modes, and recovery procedures.
- User-visible failures MUST preserve actionable diagnostics and correlation context.
- Reliability changes MUST consider retries, timeouts, idempotency, overload, and dependency failure.
- Critical state MUST have tested recovery appropriate to its durability requirements.
## MUST NOT
- MUST NOT use unbounded retries or queues.
- MUST NOT silently convert infrastructure failure into successful but incomplete output.
- MUST NOT introduce a single point of failure without documented acceptance.
## SHOULD
- Graceful degradation SHOULD preserve safe core workflows when practical.
- Reliability objectives SHOULD reflect developer impact rather than infrastructure uptime alone.
## Exceptions
Accepted reliability gaps require quantified impact, owner, compensating path, and review date.
## Verification
Use failure injection, recovery tests, service metrics, dependency maps, timeout/retry inspection, incident history, and runbook exercises.