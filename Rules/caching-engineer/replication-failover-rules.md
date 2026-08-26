# Replication and Failover

## Purpose
Ensure cache redundancy improves availability without hiding data-loss or consistency risks.

## Scope
Primary-replica, multi-node, regional replicas, promotion, and failback.

## MUST
- Replication topology MUST define acknowledged-write semantics and potential loss windows.
- Failover MUST be tested under realistic client, network, and dependency behavior.
- Promotion and failback procedures MUST define split-brain prevention and stale-node handling.
- Required failover capacity MUST be available before declaring redundancy sufficient.

## MUST NOT
- Replica count MUST NOT be equated with durability without validating replication semantics.
- Automatic failover MUST NOT be enabled where ambiguous ownership can create unsafe concurrent primaries without fencing.
- Failed nodes MUST NOT rejoin with stale state unless the platform safely reconciles or replaces it.

## SHOULD
- Track replication lag, promotion time, data-loss indicators, and client recovery time.

## Exceptions
Require explicit availability and loss trade-offs, evidence, mitigation, and approval.

## Verification
Run failover, failback, partition, and restart tests; inspect replication telemetry, client traces, and recovery objectives.