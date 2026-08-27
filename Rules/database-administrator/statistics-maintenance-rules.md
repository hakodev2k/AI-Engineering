# Statistics Maintenance

## Purpose
Keep optimizer statistics representative enough for stable plan selection without wasteful maintenance.

## Scope
Table, column, index, histogram, and optimizer statistics.

## MUST
- Statistics maintenance MUST consider data-change rate, distribution skew, query sensitivity, and engine behavior.
- Suspected stale-statistics regressions MUST be supported by plan or runtime evidence before broad maintenance.
- Large statistics operations MUST account for I/O, CPU, locking, sampling, and execution-window impact.
- Changes to automatic statistics behavior MUST be reviewed for system-wide consequences.

## MUST NOT
- MUST NOT refresh all statistics at maximum sampling merely as a default response to poor performance.
- MUST NOT disable automatic statistics features globally to solve a local issue without evidence and approval.
- MUST NOT assume recent statistics guarantee a good execution plan.

## SHOULD
- Sensitive workloads SHOULD use targeted maintenance informed by observed plan quality.
- Sampling choices SHOULD balance accuracy and operational cost.

## Exceptions
Emergency targeted refreshes may be used as mitigation when evidence points to cardinality error; follow-up root-cause review remains required.

## Verification
Compare statistics age/change counters, execution plans, cardinality estimates, maintenance duration, resource impact, and post-change performance.