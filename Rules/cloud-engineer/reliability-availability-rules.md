# Reliability and Availability Rules
## Purpose
Design cloud workloads to meet explicit service reliability objectives.
## Scope
Availability, redundancy, dependency resilience, health, and failure recovery.
## MUST
- Critical workloads MUST define measurable availability and recovery objectives.
- Redundancy decisions MUST account for correlated failures, regional or zonal dependencies, and data consistency.
- Failure behavior of critical dependencies MUST be tested or evidenced before relying on resilience claims.
## MUST NOT
- MUST NOT claim high availability solely because a managed service is used.
- MUST NOT add retries without bounded attempts, timeouts, and overload consideration.
## SHOULD
- Prefer graceful degradation for non-critical capabilities where it reduces blast radius.
## Exceptions
Exceptions require business acceptance of residual risk and documented evidence.
## Verification
Review SLOs, topology, dependency maps, resilience tests, incident evidence, health checks, and failover results.