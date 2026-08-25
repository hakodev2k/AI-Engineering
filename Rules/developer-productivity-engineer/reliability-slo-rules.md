# Developer Platform Reliability Rules
## Purpose
Treat shared developer services as production systems with explicit reliability expectations.
## Scope
CI, artifact services, registries, remote caches, portals, and shared tooling backends.
## MUST
- Critical services MUST define measurable availability or success objectives tied to developer impact.
- Dependency failures MUST have bounded timeouts and documented degradation or recovery behavior.
- Reliability incidents MUST preserve evidence and produce follow-up actions proportional to impact.
- Capacity changes MUST use observed demand and saturation evidence.
## MUST NOT
- MUST NOT mask outages by excluding failed requests from reliability calculations without documented rationale.
- MUST NOT deploy high-risk platform changes without rollback readiness.
## SHOULD
- Error budgets SHOULD inform investment and release risk for mature shared services.
## Exceptions
Best-effort services must be explicitly classified and communicate limitations.
## Verification
Inspect SLO definitions, dashboards, dependency behavior, incident records, and rollback exercises.