# Query Plan Analysis Rules
## Purpose
Require execution evidence for query-level performance decisions.
## Scope
SQL execution plans, optimizer behavior, and runtime operator analysis.
## MUST
- Capture the relevant estimated or actual plan when diagnosing material query cost.
- Compare estimates with actual row counts where the engine exposes both.
- Investigate expensive scans, joins, sorts, spills, lookups, and cardinality errors in workload context.
## MUST NOT
- Rewrite queries solely because a plan operator appears expensive without validating runtime impact.
- Assume a plan observed on one data distribution represents all environments.
## SHOULD
- Preserve representative plans for critical queries to support regression analysis.
## Exceptions
When plan capture is unsafe in production, use approved lower-impact telemetry or a representative replica.
## Verification
Review captured plans, runtime statistics, row estimates, operator costs, and correlated latency or resource evidence.