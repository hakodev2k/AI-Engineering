# Cost Efficiency Rules

## Purpose
Control database cost without compromising declared reliability, security, or performance guarantees.

## Scope
Compute, storage, replicas, indexes, backups, network transfer, licensing, and operational overhead.

## MUST
- Material cost changes MUST identify the resource driver and expected impact on service objectives.
- Cost optimization MUST preserve required recovery, durability, security, and failover headroom.
- Expensive storage growth, replication, and cross-region transfer MUST be observable.
- Retention and indexing policies MUST be periodically reviewed against actual value and usage.

## MUST NOT
- MUST NOT reduce replica count, backup coverage, or security controls solely to meet cost targets without risk approval.
- MUST NOT claim savings without comparing normalized workload and service quality.

## SHOULD
- Cost SHOULD be evaluated per useful workload unit rather than aggregate spend alone.

## Exceptions
Temporary overprovisioning is acceptable when justified by migration, incident, or forecast uncertainty and has an exit criterion.

## Verification
Review billing data, utilization, workload metrics, architecture assumptions, and before/after service objectives.