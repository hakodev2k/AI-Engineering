# High Availability

## Purpose
Maintain database service through component failures without hiding unsafe assumptions.

## Scope
Replication, clustering, quorum, failover, fencing, health checks, and availability topology.

## MUST
- Availability design MUST document failure domains, quorum behavior, failover triggers, data-loss exposure, and client reconnection behavior.
- Automatic failover MUST be tested for representative failure modes before relying on it for production objectives.
- Replica health and replication delay MUST be monitored with actionable thresholds.
- Planned topology changes MUST preserve a safe path back to a known-good state.

## MUST NOT
- MUST NOT force quorum or promote a replica when split-brain or divergent-write risk is unresolved without explicit incident authority.
- MUST NOT equate replica process health with data currency.
- MUST NOT place all replicas in one avoidable failure domain when availability requirements demand isolation.

## SHOULD
- Failover drills SHOULD validate application behavior, not only database role transition.
- Capacity SHOULD allow the surviving topology to carry expected critical load.

## Exceptions
Reduced redundancy requires documented duration, business impact, monitoring, restoration plan, and approval.

## Verification
Inspect topology, failure-domain placement, replication metrics, failover tests, quorum settings, client behavior tests, and capacity evidence.