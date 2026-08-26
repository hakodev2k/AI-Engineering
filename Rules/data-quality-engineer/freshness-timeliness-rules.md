# Freshness and Timeliness Rules
## Purpose
Ensure data arrives and becomes usable within promised time bounds.
## Scope
Ingestion latency, processing latency, event time, and publication SLAs.
## MUST
- Critical datasets MUST define freshness relative to a meaningful source or event timestamp.
- Freshness checks MUST distinguish late source data from pipeline delay.
- Breaches MUST expose affected partitions and consumer impact.
## MUST NOT
- MUST NOT use processing completion time as a substitute for source freshness when they differ materially.
- MUST NOT hide stale data behind successful job status.
## SHOULD
- Freshness budgets SHOULD allocate latency across pipeline stages.
## Exceptions
Planned delays require explicit consumer communication and revised expectations.
## Verification
Inspect timestamps, lag distributions, scheduler history, pipeline metrics, and SLA alerts.