# Performance Diagnostics

## Purpose
Diagnose database performance from evidence and avoid speculative production tuning.

## Scope
Latency, throughput, waits, query execution, locking, resource saturation, and workload changes.

## MUST
- Performance investigations MUST establish a time window, affected workload, baseline, and measurable symptom.
- Tuning changes MUST be supported by relevant evidence such as execution plans, wait data, runtime metrics, or controlled benchmarks.
- Before/after measurements MUST use comparable workload conditions where practical.
- High-risk production tuning MUST include rollback criteria and approval.

## MUST NOT
- MUST NOT claim improvement from configuration or index changes without measurement.
- MUST NOT clear caches, restart services, or terminate workloads solely to hide a symptom without preserving diagnostic evidence when feasible.
- MUST NOT optimize one query while ignoring material system-wide regression it causes.

## SHOULD
- Root cause SHOULD be bounded before broad corrective changes.
- Diagnostics SHOULD distinguish database time from application and network time.

## Exceptions
Emergency mitigation may precede full diagnosis when availability is threatened, but evidence and follow-up analysis must be preserved.

## Verification
Review baselines, query plans, wait metrics, benchmarks, change records, and post-change telemetry.