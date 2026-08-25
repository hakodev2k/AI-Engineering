# Statistics and Planner Rules
## Purpose
Keep PostgreSQL cardinality estimates and plan choices trustworthy.
## Scope
ANALYZE, statistics targets, extended statistics, planner settings, and skew.
## MUST
- Investigate stale or insufficient statistics when estimates materially diverge from observed rows.
- Validate planner-setting changes against a representative workload, not one query alone.
- Document cluster-wide planner changes and their rollback path.
## MUST NOT
- Disable planner strategies globally to fix a local query without workload-wide evidence.
## SHOULD
- Use extended statistics for demonstrated cross-column correlation or dependency problems.
## Exceptions
Session-local planner controls may be used diagnostically without being treated as a permanent fix.
## Verification
Compare plans, estimates, statistics freshness, workload regressions, and before/after latency.