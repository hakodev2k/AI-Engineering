# Service Discovery
## Purpose
Ensure destinations resolve consistently and fail predictably.
## Scope
Service registries, DNS, endpoint discovery, locality, health, and stale endpoints.
## MUST
- Mesh discovery sources MUST have defined ownership and consistency expectations.
- Endpoint health and removal behavior MUST be tested during failures.
- Cross-cluster discovery MUST define naming and collision rules.
## MUST NOT
- MUST NOT depend on undocumented registry precedence.
- MUST NOT route to stale endpoints beyond an accepted convergence window.
- MUST NOT introduce ambiguous service names across trust boundaries.
## SHOULD
- Discovery dependencies SHOULD be observable for latency, errors, and propagation lag.
## Exceptions
Static endpoint exceptions require owner, lifecycle, and stale-address mitigation.
## Verification
Test resolution, endpoint updates, failover, stale removal, namespace collisions, and discovery telemetry.