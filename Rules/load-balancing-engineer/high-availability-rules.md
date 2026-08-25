# High Availability Rules

## Purpose
Eliminate avoidable single points of failure and ensure the traffic tier survives expected component and zone failures.

## Scope
Load-balancer replicas, zones, regions, control planes, dependencies, and failover paths.

## MUST
- Availability design MUST identify single points of failure across data plane, control plane, DNS, certificates, network paths, and backend pools.
- Critical services MUST distribute traffic-serving capacity across independent failure domains appropriate to their availability objective.
- Failover paths MUST be exercised before they are relied upon in production.
- Redundant components MUST not share an undocumented common dependency that defeats redundancy.
- Recovery objectives MUST align with measured or tested convergence and failover times.

## MUST NOT
- MUST NOT claim high availability solely because multiple instances exist.
- MUST NOT place all redundant capacity in one failure domain when zone or site failure is in scope.
- MUST NOT treat an untested standby as guaranteed capacity.

## SHOULD
- Prefer active-active designs when they reduce recovery uncertainty without excessive complexity.
- Keep failover mechanisms simple and observable.

## Exceptions
Intentional single-region or single-zone designs require documented business acceptance and recovery expectations.

## Verification
Review topology, dependency graphs, failure-domain placement, failover tests, recovery timing, and post-failover capacity.