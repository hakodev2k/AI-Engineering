# Orchestration and Scheduling Rules

## Purpose
Keep data workflows dependency-aware, recoverable, observable, and safe under retries, missed schedules, and backfills.

## Scope
Applies to workflow schedulers, DAGs, dependency graphs, triggers, sensors, retries, and cross-pipeline coordination.

## MUST
- Workflow dependencies MUST be explicit and based on verifiable completion conditions rather than assumed wall-clock timing.
- Every scheduled workflow MUST define retry limits, timeout behavior, failure notification, ownership, and recovery procedure.
- Catch-up and backfill behavior MUST be intentional and bounded to prevent accidental workload storms.
- Cross-system triggers MUST tolerate duplicate delivery or provide an explicit deduplication mechanism.
- Critical workflow changes MUST be tested with representative dependency and failure scenarios before production rollout.

## MUST NOT
- MUST NOT use arbitrary sleep intervals as correctness guarantees for upstream readiness.
- MUST NOT configure unlimited retries or recursively triggered recovery paths that can amplify incidents.
- MUST NOT mark a workflow successful when required downstream publication or validation has failed.

## SHOULD
- Prefer dependency contracts based on dataset versions, partitions, events, or explicit readiness markers.
- SHOULD expose queue delay, task duration, retry count, missed schedules, and critical-path latency.

## Exceptions
Exceptions require documented limitations, risk, monitoring, recovery strategy, and approval where production reliability is affected.

## Verification
Inspect DAG definitions, scheduler configuration, retry/timeout policies, backfill tests, dependency simulations, and orchestration telemetry.