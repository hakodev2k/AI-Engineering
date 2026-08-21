# Workflow — Delegate with Budget

## Trigger
An orchestrator proposes two or more concurrent subagents or a retry fan-out.

## Goal
Gain useful parallel throughput while bounding aggregate context/token/retry amplification.

## Inputs
Parent context estimate, child task manifests, expected work tokens, budget config, optional serial baseline/historical actuals.

## Baseline
For recurring workloads, record single-agent or serialized tokens and wall-clock time. If unavailable, label amplification ratio as estimated rather than measured.

## Stages
1. **Observe** — measure parent context and describe child deliverables.
2. **Diagnose overlap** — normalize task signatures and reject duplicates.
3. **Estimate** — calculate inherited context, child work, retry exposure, per-child and aggregate tokens.
4. **Hypothesize benefit** — identify what wall-clock work is actually independent.
5. **Budget decision** — Budget Controller returns allow/warn/block.
6. **Improve proposal** — if blocked, reduce child count, scope context, serialize, or replace simple tasks with deterministic tools.
7. **Execute** — spawn only the accepted bounded set.
8. **Measure again** — collect actual child tokens, retries, compactions, output usefulness, and elapsed time.
9. **Verify** — compare actual versus baseline/prediction and record regression.

## Responsible agent
Orchestrator owns task design/execution. Budget Controller owns independent pre-spawn decision and post-run budget verification.

## Tools
`fanout_budget.py`, session/token telemetry, deterministic task normalization, provider usage records.

## Outputs
Budget decision, accepted fan-out manifest, actual metrics, before/after comparison.

## Checkpoints
C1 distinct tasks; C2 budget passes; C3 no child exceeds bounded retry policy; C4 observed metrics reconciled.

## Metrics
Aggregate tokens, per-child tokens, serial baseline, amplification ratio, wall-clock speedup, retries, compactions, duplicate work, useful deliverables.

## Retry policy
One redesigned fan-out proposal after a block. Maximum retries per child come from config and are included in the predicted worst-case cost.

## Stop conditions
Stop when budget passes and all children finish within retry bounds, or when the redesigned proposal still exceeds budget.

## Failure path
Preserve successful child artifacts, do not restart completed work from blank context, serialize remaining work or escalate.

## Verification
A performance improvement is verified only when observed elapsed time/resource usage improves against the stated baseline without reducing result quality.

## Definition of Done
Baseline exists or estimate is labeled; fan-out budgeted; duplicate delegation excluded; bounded execution completed; actual metrics captured; before/after comparison recorded.