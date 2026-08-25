# Query Plan Rules
## Purpose
Make PostgreSQL query tuning evidence-driven.
## Scope
Planner estimates, execution plans, statistics, joins, scans, sorts, and parallelism.
## MUST
- Compare estimated and actual behavior on representative data before claiming a tuning improvement.
- Investigate large row-estimate errors, spills, repeated loops, and unexpectedly expensive nodes.
- Preserve equivalent query semantics when optimizing.
## MUST NOT
- Treat planner cost as elapsed time.
- Run intrusive EXPLAIN ANALYZE on production workloads without safety review.
## SHOULD
- Correct statistics or data-model causes before forcing plan behavior.
## Exceptions
Production-only investigations require bounded impact and explicit operational approval.
## Verification
Capture plans, runtime distributions, buffer/I/O evidence, statistics freshness, and before/after measurements.