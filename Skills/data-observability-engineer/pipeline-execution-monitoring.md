# Pipeline Execution Monitoring

## Purpose
Monitor data jobs and orchestration so execution failures, retries, stalls, and degraded runtimes are visible in the context of data-product impact.

## When to use
Use for batch pipelines, ELT/ETL workflows, scheduled transformations, CDC jobs, and orchestrated dependencies.

## Inputs
Job metadata, orchestration state, task duration history, retry policy, dependency graph, dataset ownership, SLAs/SLOs.

## Preconditions
Job identifiers and their produced data assets must be mappable.

## Context to inspect
Inspect schedules, dependencies, retries, pools, queues, worker resources, historical runtimes, skipped tasks, backfills, and downstream publication steps.

## Core knowledge
Execution health is necessary but not sufficient for data health. A successful job may emit incorrect or incomplete data; execution telemetry should therefore be correlated with data-level checks.

## Procedure
1. Inventory critical jobs and produced assets.
2. Capture state transitions, duration, retries, queue delay, and failure cause.
3. Build baseline runtime distributions by schedule and workload class.
4. Detect stuck, repeatedly retried, skipped, and anomalously slow tasks.
5. Correlate execution incidents to affected datasets through lineage.
6. Include source availability and infrastructure signals where diagnostic.
7. Route alerts to responsible owners with run IDs and failure context.
8. Test worker loss, timeout, dependency failure, and retry exhaustion.
9. Review noisy rules and stale ownership regularly.

## Decision points
Alert on user-impacting critical-path failures immediately; aggregate low-impact transient retries. Use duration anomaly thresholds for variable jobs rather than fixed limits when justified.

## Common failure patterns
- Alerting on every retry
- No distinction between queue time and execution time
- Monitoring job success without produced-data checks
- Ignoring skipped tasks
- No correlation to downstream impact

## Verification
Inject representative task failures and delays, confirm diagnostic context, and verify recovery state only after dependent data is valid.

## Expected output
Execution telemetry, critical-path alerts, runtime baselines, and linked operational runbooks.

## Stop conditions
Stop when job-to-dataset mapping is unavailable for critical workflows or production orchestration changes require separate approval.