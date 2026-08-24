# High Availability

## Purpose
Ensure redundancy actually survives expected failures rather than merely duplicating components.

## Scope
Windows failover clustering, redundant services, quorum, load distribution, dependencies, and maintenance.

## MUST
- HA design MUST identify failure domains, quorum/dependency behavior, recovery objectives, and capacity after component loss.
- Failover MUST be tested under representative conditions before relying on it for critical service guarantees.
- Maintenance MUST preserve quorum and sufficient serving capacity.
- Cluster-wide destructive or quorum changes MUST require explicit human approval.

## MUST NOT
- MUST NOT count components sharing the same critical dependency as independent redundancy.
- MUST NOT change quorum or force cluster state without understanding split-brain and data-integrity consequences.
- MUST NOT declare HA healthy solely because all nodes are online.

## SHOULD
- Monitor replication, quorum, dependency, failover duration, and degraded-capacity states.
- Exercise planned and unplanned failover periodically.

## Exceptions
Require failure analysis, evidence, residual risk, temporary controls, and approval.

## Verification
Review cluster validation, quorum, dependency maps, capacity, failover tests, event logs, monitoring, and post-failover application correctness.