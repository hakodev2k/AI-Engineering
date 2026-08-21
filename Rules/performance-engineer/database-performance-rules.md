# Database Performance Rules
## Purpose
Optimize database work using query and runtime evidence.
## Scope
Queries, plans, indexes, locking, transactions, connections, and data volume.
## MUST
- Use execution plans and runtime measurements for material query optimization.
- Test representative cardinalities and parameter distributions.
- Evaluate index changes for read benefit, write cost, storage, and maintenance impact.
## MUST NOT
- Add indexes solely from intuition without validating workload impact.
- Use unbounded queries on performance-critical paths without explicit justification.
## SHOULD
- Monitor slow queries, waits, blocking, and connection-pool pressure.
## Exceptions
Emergency mitigation may precede full analysis but requires follow-up evidence.
## Verification
Inspect plans, query metrics, waits, indexes, load results, and regression tests.