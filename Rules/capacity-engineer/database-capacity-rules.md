# Database Capacity

## Purpose
Protect database service objectives by treating database capacity as a multidimensional constraint.

## Scope
Applies to transactional and analytical databases, managed database services, replicas, and shared database infrastructure.

## MUST
- Database capacity planning MUST include CPU, memory, connections, storage growth, IOPS or throughput, replication lag, and query concurrency where relevant.
- Capacity conclusions MUST use query or workload evidence rather than instance utilization alone.
- Growth plans MUST account for index size, maintenance operations, backups, replication, and migration overhead.
- Scaling decisions MUST consider operational limits and topology effects, including failover capacity.

## MUST NOT
- MUST NOT assume storage expansion resolves compute, locking, query-plan, or I/O bottlenecks.
- MUST NOT count read replicas as write capacity.
- MUST NOT plan normal operation so close to connection or storage limits that maintenance or failover becomes unsafe.

## SHOULD
- Track workload-normalized metrics such as transactions per second and resource cost per transaction.
- Use representative query plans and wait statistics when diagnosing database capacity constraints.

## Exceptions
Exceptions require evidence, risk, compensating controls, and an owner-approved remediation timeline.

## Verification
Inspect database metrics, query plans, wait statistics, storage trends, replication behavior, limits, and failover tests.
