# Query Performance Rules

## Purpose
Keep database workloads within latency and resource budgets using measured evidence.

## Scope
SQL, query plans, indexes, statistics, caching interactions, and workload regressions.

## MUST
- Investigate slow queries using runtime metrics and execution plans.
- Establish before-and-after measurements for performance changes.
- Review high-cost queries for cardinality, scans, joins, sorting, and index effectiveness.
- Protect critical workloads from unbounded queries and runaway resource consumption.

## MUST NOT
- Do not claim optimization without measured improvement under representative conditions.
- Do not add indexes without assessing write cost, storage, and maintenance impact.

## SHOULD
- Track plan regressions and top resource-consuming queries continuously.

## Exceptions
Temporary mitigations require an owner, expiry, and follow-up root-cause work.

## Verification
Inspect query plans, latency distributions, resource metrics, regression reports, and benchmark evidence.