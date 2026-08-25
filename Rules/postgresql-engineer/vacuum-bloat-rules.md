# Vacuum and Bloat Rules
## Purpose
Maintain MVCC health and prevent transaction-ID and storage pathologies.
## Scope
Autovacuum, freeze, dead tuples, table/index bloat, and long-lived snapshots.
## MUST
- Monitor vacuum progress, dead tuples, transaction age, and freeze risk for critical databases.
- Tune autovacuum from workload evidence at table level when defaults are insufficient.
- Treat wraparound risk as production-critical.
## MUST NOT
- Disable autovacuum globally as a performance workaround.
- Reclaim bloat with blocking rewrites without capacity and availability planning.
## SHOULD
- Address root causes such as long transactions before repeated manual vacuum intervention.
## Exceptions
Temporary autovacuum changes require bounded duration and restoration verification.
## Verification
Inspect pg_stat tables, transaction ages, vacuum logs, relation sizes, and maintenance outcomes.