# Data Orchestration

## Purpose
Build maintainable workflow orchestration that expresses dependencies, schedules, retries, backfills, ownership, and operational state explicitly.

## When to use
Use for multi-step data workflows, cross-system dependencies, scheduled transformations, and governed backfills.

## Inputs
Workflow graph, dependencies, schedules, SLAs, retry semantics, compute interfaces, ownership, and backfill requirements.

## Context to inspect
Existing DAG conventions, scheduler capacity, task queues, concurrency limits, secrets, sensors, retry behavior, and incident history.

## Core knowledge
An orchestrator should coordinate work rather than contain business transformation logic. Tasks should be restartable, observable, and as idempotent as practical. Scheduling, data availability, and data freshness are distinct concepts.

## Procedure
1. Model data dependencies instead of relying on arbitrary clock offsets.
2. Define task boundaries around independently retryable units.
3. Keep transformation logic testable outside the orchestrator.
4. Set timeouts, retries, and concurrency by failure mode.
5. Define parameterized backfills and bounded catch-up behavior.
6. Protect credentials through platform secret mechanisms.
7. Add ownership, documentation, lineage hooks, and alert routing.
8. Prevent overlapping runs where outputs are not concurrency-safe.
9. Test partial failures and scheduler restarts.
10. Monitor queue delay, runtime, success rate, and freshness separately.

## Decision points
Use event/data-aware triggers when completion depends on upstream data; schedules are appropriate for predictable periodic work. Split DAGs when ownership or failure isolation improves; avoid fragmentation that obscures lineage.

## Common failure patterns
Long monolithic tasks, sleep-based dependencies, infinite retries, scheduler as transformation engine, uncontrolled dynamic task creation, and backfills that overwhelm dependencies.

## Verification
Force failures at task boundaries, rerun safely, execute bounded backfills, validate concurrency controls, and confirm alerts reach accountable owners.

## Expected output
Operational DAGs/workflows, retry and timeout policy, backfill procedure, ownership metadata, tests, and monitoring.

## Stop conditions
Stop when dependency semantics are unknown, reruns can corrupt outputs, or a requested backfill exceeds safe capacity without an approved plan.