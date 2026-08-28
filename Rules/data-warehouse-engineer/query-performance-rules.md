# Query Performance Rules

## Purpose
Require evidence-based optimization of warehouse workloads.

## Scope
Applies to analytical SQL, views, materializations, joins, aggregations, and workload tuning.

## MUST
- Performance work MUST begin with representative workload evidence such as runtime, scan volume, query plan, concurrency, or queue time.
- Expensive joins and aggregations MUST be reviewed for grain correctness and avoidable data movement.
- Regressions on critical workloads MUST have defined detection thresholds.
- Optimization changes MUST preserve result correctness with regression tests or reconciliations.

## MUST NOT
- MUST NOT optimize solely from intuition or isolated synthetic examples.
- MUST NOT trade correctness for lower runtime without explicit business approval.

## SHOULD
- Prefer reducing scanned data and unnecessary recomputation before adding complexity.
- Materialization SHOULD be justified by workload frequency, freshness needs, and cost.

## Exceptions
Emergency mitigations require documented risk and follow-up validation.

## Verification
Inspect execution plans, runtime history, scan statistics, concurrency metrics, benchmark comparisons, and result checks.