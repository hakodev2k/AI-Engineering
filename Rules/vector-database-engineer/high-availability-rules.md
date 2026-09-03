# High Availability

## Purpose
Ensure vector retrieval remains available through expected infrastructure and software failures.

## Scope
Applies to replicas, failure domains, routing, health checks, quorum behavior, failover, and degraded modes.

## MUST
- Availability architecture MUST map replicas and critical dependencies across appropriate failure domains.
- Health checks MUST reflect serving capability rather than process existence alone.
- Failover behavior MUST be tested under node, zone, network, and dependency failures relevant to the deployment.
- Degraded modes MUST preserve mandatory security and correctness boundaries.
- Recovery objectives and tolerated data/freshness loss MUST be explicit.

## MUST NOT
- MUST NOT count replicas in the same failure domain as independent resilience.
- MUST NOT route traffic to nodes that are alive but unable to serve required index state.
- MUST NOT disable authorization or tenancy controls during degraded operation.

## SHOULD
- Failover SHOULD be automated when automation is safer and demonstrably reliable.
- Readiness SHOULD account for index loading and warm-up.
- Failure tests SHOULD include rebuild and rebalance pressure.

## Exceptions
Exceptions require documented risk, compensating controls, recovery plan, evidence, and production-owner approval.

## Verification
Review topology, health checks, chaos/failure tests, recovery exercises, SLOs, replica telemetry, routing behavior, and incident evidence.