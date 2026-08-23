# Workflow: Measure → Diagnose → Optimize Tool Yields

## Trigger
Latency SLO miss, increased agent duration, or traces showing repeated serial tool/model transitions.

## Goal
Reduce latency caused by unnecessary yields without changing task correctness or safety boundaries.

## Inputs
Representative workload, trace JSONL, success criteria, optional latency threshold.

## Baseline
Run the workload unchanged at least three times when practical. Record median total duration, p95 yield duration, yields/task, tool-active time and success result.

## Stages
1. **Observe** — capture trace.
2. **Measure** — run `analyze_tool_yields.py`.
3. **Diagnose** — localize tool time vs model/orchestration gaps.
4. **Form hypothesis** — select one high-value candidate and document dependency assumptions.
5. **Independent review** — Trace Performance Reviewer approves/rejects.
6. **Implement** — bounded parallel batch or programmatic execution; change one strategy at a time.
7. **Measure again** — repeat equivalent workload.
8. **Compare** — require latency improvement and unchanged success criteria.
9. **Verify** — run regression gate.

## Checkpoints
Baseline exists; dependency evidence exists; concurrency bound defined; correctness criteria preserved; post-change trace captured.

## Metrics
Total duration, yields/task, p50/p95 yield ms, tool-active ratio, success rate, retry/error rate.

## Retry policy
Maximum two optimization revisions after the baseline. Each failed attempt must be reverted before the next hypothesis.

## Stop conditions
Success when target metric improves and verification passes. Stop without change after two unsuccessful/safety-rejected revisions.

## Failure path
Restore baseline configuration, retain traces, record why the hypothesis failed, escalate if latency remains outside SLO.

## Definition of Done
Measured improvement, preserved task correctness, no new authorization/order/cancellation regressions, and deterministic regression evidence.