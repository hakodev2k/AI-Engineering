# Reliability and Availability Rules
## Purpose
Design AWS workloads to meet explicit resilience objectives.
## Scope
Availability zones, regions, redundancy, health checks, failure isolation, and recovery behavior.
## MUST
- Define availability and recovery objectives for critical workloads before choosing resilience mechanisms.
- Eliminate single points of failure where objectives require continued service.
- Test failure behavior of critical dependencies and recovery paths.
- Align health checks with actual service readiness rather than process existence alone.
## MUST NOT
- Claim high availability solely because a managed AWS service is used.
- Add cross-region complexity without requirements and operational readiness.
## SHOULD
- Prefer multi-AZ designs for workloads whose availability objectives justify them.
## Exceptions
Accepted resilience gaps require impact, likelihood, owner, mitigation, and review date.
## Verification
Review architecture, AZ placement, health checks, dependency maps, fault tests, recovery exercises, and measured SLO evidence.