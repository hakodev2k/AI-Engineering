# Orchestration Rules

## Purpose
Ensure analytical workloads execute in a controlled, dependency-aware, recoverable manner.

## Scope
Applies to scheduled jobs, DAGs, triggers, dependencies, retries, backfills, and environment promotion.

## MUST
- Workflow dependencies MUST reflect actual data readiness requirements.
- Retries MUST be bounded and appropriate to the failure mode.
- Critical jobs MUST define timeout, failure, and recovery behavior.
- Orchestration MUST distinguish successful execution from successful data validation.
- Backfills and replays MUST have bounded scope and documented impact before execution.

## MUST NOT
- MUST NOT rely on arbitrary sleep intervals as the primary dependency mechanism when readiness can be tested.
- MUST NOT retry deterministic data errors indefinitely.
- MUST NOT launch overlapping runs that can corrupt shared outputs unless concurrency safety is proven.

## SHOULD
- Prefer idempotent tasks and explicit state transitions.
- Separate recoverable transient failures from data-quality failures in alerting and retries.

## Exceptions
Exceptions require documented rationale, concurrency risk, and recovery evidence.

## Verification
Inspect DAG definitions, retry policies, concurrency settings, run history, failure paths, and replay tests.