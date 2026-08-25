# Deadlock and Contention Rules
## Purpose
Resolve concurrency failures at their cause rather than masking symptoms.
## Scope
Deadlocks, hot rows/pages, latch contention, and serialization bottlenecks.
## MUST
- Capture deadlock graphs or equivalent evidence before selecting a durable fix when available.
- Identify participating statements, resource order, frequency, and business impact.
- Verify fixes under concurrent load and confirm correctness is unchanged.
## MUST NOT
- Treat unbounded retries as a deadlock solution.
- Suppress deadlock errors without bounded handling and telemetry.
## SHOULD
- Reduce hot-resource concentration through access-pattern or data-layout changes when justified.
## Exceptions
Bounded retry may mitigate transient deadlocks while root-cause remediation is prepared.
## Verification
Review deadlock captures, wait statistics, retry metrics, concurrency tests, and post-change incident frequency.