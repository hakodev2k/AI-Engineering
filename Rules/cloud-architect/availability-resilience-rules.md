# Availability and Resilience Rules

## Purpose
Design cloud workloads to meet explicit availability objectives and degrade predictably when components fail.

## Scope
Applies to redundancy, failure domains, dependency design, traffic management, health checks, failover, and graceful degradation.

## MUST
- Critical workloads MUST define measurable availability objectives and identify the failure scenarios those objectives cover.
- Redundancy MUST span independent failure domains appropriate to the stated availability requirement.
- Every critical dependency MUST have documented timeout, retry, circuit-breaking or failure-isolation behavior where applicable.
- Failover mechanisms MUST be tested under realistic conditions before they are relied upon for production recovery.
- Designs MUST identify single points of failure and either remove them or explicitly accept their risk.

## MUST NOT
- MUST NOT claim high availability solely because a service is managed or deployed in multiple instances.
- MUST NOT use unbounded retries or synchronized retry behavior that can amplify outages.
- MUST NOT introduce cross-region complexity without requirements that justify its operational and consistency costs.

## SHOULD
- Prefer graceful degradation over complete failure when business behavior permits.
- Use bulkheads and fault containment to limit blast radius.

## Exceptions
Exceptions require documented availability impact, business acceptance, compensating measures, and a review date.

## Verification
Review SLOs, topology, dependency maps, fault-injection results, failover tests, health-check behavior, incident evidence, and monitoring coverage.