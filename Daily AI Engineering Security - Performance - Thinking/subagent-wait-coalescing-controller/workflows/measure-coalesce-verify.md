# Workflow: Measure → Coalesce → Verify

## Trigger
Wait/status/list-agent traffic is frequent, timeout-heavy, or dominates orchestration turns.

## Goal
Reduce no-change polling turns and resource consumption while preserving correctness and fast delivery of material child-state changes.

## Inputs
Orchestration logs, child-state API/events, timeout configuration, token/latency metrics, task-level tests.

## Baseline
Measure wait-family call count, timeout/no-change ratio, model-visible turns, input tokens, context size, task duration, and terminal-state detection latency.

## Stages
1. Observe and capture baseline.
2. Diagnose repeated identical state fingerprints, stale children, and invalid wait targets.
3. Form a measurable hypothesis for coalescing/backoff savings.
4. Implement state fingerprinting, no-change suppression, adaptive backoff, and liveness reconciliation.
5. Measure the same workload again.
6. If metrics do not improve, adjust one diagnosed parameter and retry once.
7. Run independent benchmark verification and task-level correctness checks.

## Responsible agent
Host/orchestrator implements; `subagents/orchestration-benchmark-agent.md` verifies.

## Tools
`scripts/wait_loop_analyzer.py`, event logs, monotonic timers, task tests/evals.

## Outputs
Baseline metrics, optimized metrics, state-change trace, verification result.

## Checkpoints
Baseline before changes; critical states bypass coalescing; stale children reconciled once; before/after workload comparable; final task outcome verified.

## Metrics
Wait calls/task, no-change wait ratio, model turns/task, tokens/task, wait payload bytes, end-to-end duration, terminal/error/approval detection latency.

## Retry policy
Maximum two optimization cycles total.

## Stop conditions
Stop on missed critical event, ambiguous child state after reconciliation, invalid target repeated after invalidation, or no measurable improvement after the second cycle.

## Failure path
Disable coalescing for the affected child/topology, restore safe baseline behavior, preserve evidence, and escalate the runtime defect instead of looping indefinitely.

## Verification
Independent benchmark agent compares logs and task results.

## Definition of Done
No-change model turns materially decrease; resource metrics improve; critical event latency remains within configured budget; task correctness/tests pass; retries remain bounded; no stale target can drive an unbounded loop.