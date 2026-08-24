# High Availability and Maintenance Rules

## Purpose
Perform host maintenance without violating service redundancy or creating correlated failures.

## Scope
Applies to redundant hosts, clusters, load-balanced systems, maintenance drains, failover, and rolling host operations.

## MUST
- Maintenance MUST confirm current redundancy and health before intentionally removing capacity.
- The maximum simultaneous host impact MUST respect failure-domain and service availability requirements.
- Draining or failover MUST be validated by service-level evidence before continuing a rollout.
- Maintenance procedures MUST account for stateful workloads, quorum, fencing, and recovery ordering where relevant.
- A degraded cluster MUST be reassessed before planned maintenance proceeds.

## MUST NOT
- Redundant hosts in the same failure domain MUST NOT be restarted together unless the architecture explicitly tolerates it and the action is approved.
- Process success or host reachability MUST NOT be used alone to prove application failover succeeded.
- Quorum or fencing safeguards MUST NOT be bypassed merely to accelerate maintenance.

## SHOULD
- Automate safe drain, health gate, and rejoin checks.
- Spread maintenance across failure domains.
- Test failover behavior before relying on it during critical maintenance.

## Exceptions
Emergency maintenance on degraded systems requires explicit risk acceptance, restoration priority, and a clear stop condition.

## Verification
Inspect cluster/service health, capacity and failure-domain state, drain results, traffic or workload relocation, quorum, rejoin status, and service-level metrics after each maintenance stage.