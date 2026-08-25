# Traffic Management
## Purpose
Keep service-to-service routing predictable, reversible, and evidence-driven.
## Scope
Mesh routing, splitting, mirroring, retries, timeouts, and failover.
## MUST
- Routing changes MUST declare affected services, match conditions, precedence, and rollback criteria.
- Progressive traffic shifts MUST use observable increments with health gates.
- Retry and timeout policies MUST account for end-to-end latency budgets and downstream behavior.
## MUST NOT
- MUST NOT route production traffic to an unverified destination.
- MUST NOT combine retries across layers without bounding amplification.
- MUST NOT use traffic mirroring where copied requests can cause side effects.
## SHOULD
- Route policies SHOULD be version-controlled and tested before promotion.
## Exceptions
Exceptions require documented reason, blast radius, evidence, rollback path, and approval for production risk.
## Verification
Review rendered mesh configuration, route precedence, integration tests, telemetry, and rollback rehearsal evidence.