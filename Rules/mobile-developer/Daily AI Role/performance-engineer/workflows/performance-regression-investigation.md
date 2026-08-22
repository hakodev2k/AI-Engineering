# Workflow: Performance Regression Investigation

## Trigger
Measured latency, throughput, resource, or scalability regression.

## Goal
Identify cause, restore target performance safely, and prevent recurrence.

## Stages
1. Intake: metric, baseline, affected workload, first bad window, severity.
2. Reproduce or confirm from production evidence.
3. Parallel evidence: Telemetry Analyst segments telemetry; code diff review identifies changes; Code Path Profiler prepares targeted profiling.
4. Synchronize at hypothesis checkpoint.
5. Run targeted isolation experiments sequentially where environment interference is possible.
6. Select reversible mitigation or optimization.
7. Benchmark Executor runs before/after protocol.
8. Verification Agent independently validates effect and guardrails.
9. Record root cause and prevention gate.

## Retry
Maximum two failed test-fix-retest cycles before escalation.

## Escalation
Escalate when representative reproduction is impossible, evidence conflicts, or mitigation introduces correctness/security/reliability risk.

## Definition of done
Original regression metric recovered, evidence retained, root cause confidence recorded, prevention action owned.