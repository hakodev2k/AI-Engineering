# Failover Capacity

## Purpose
Ensure resilience designs have enough real capacity to operate during failures and maintenance.

## Scope
Applies to zone, region, cluster, node, shard, replica, and dependency failover scenarios.

## MUST
- Capacity plans MUST model the largest credible failure domain required by the service availability objective.
- Surviving capacity MUST be validated against expected failover demand, redistribution behavior, and degraded-mode limits.
- Failover tests MUST verify both traffic handling and recovery backlog where work accumulates during disruption.
- Reserved recovery capacity MUST remain protected from routine consumption unless risk is explicitly accepted.

## MUST NOT
- MUST NOT count failed or isolated resources toward failover capacity.
- MUST NOT assume even traffic redistribution when routing or shard topology can create hotspots.
- MUST NOT declare a topology resilient when failover requires unvalidated emergency scaling.

## SHOULD
- Include maintenance and rolling-upgrade scenarios in failover capacity analysis.
- Model simultaneous demand spikes and failures when that scenario is credible.

## Exceptions
Reduced failover margin requires documented exposure, time bound, compensating controls, and human approval.

## Verification
Review topology, failure-domain math, traffic distribution, failover drills, degraded-mode metrics, and recovery timing.
