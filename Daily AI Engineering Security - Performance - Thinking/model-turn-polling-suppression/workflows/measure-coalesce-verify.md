# Workflow: Measure → Coalesce → Verify

## Trigger
Polling-only turns exceed budget or a long-running multi-agent task shows coordination cost/latency growth.

## Goal
Reduce unnecessary model turns while preserving successful completion and bounded wakeup latency.

## Inputs
Representative workload, baseline trace, `config/polling-budget.json`, task-level verification.

## Baseline
Record total/model/polling turns, tokens, no-progress sequences, p50/p95 latency where available, wakeup delay, and task outcome.

## Context
Host scheduler semantics, status/event APIs, child lifecycle behavior, approval/error wakeups.

## Stages
1. **Observe** — capture an unchanged production-like workload without optimization.
2. **Measure** — analyze baseline trace.
3. **Diagnose** — identify no-change polling, stale lifecycle, duplicated target polls, and fixed-cadence loops.
4. **Hypothesize** — choose one mechanism: event wakeup, state-change gate, coalescing, adaptive backoff, or lifecycle repair.
5. **Implement** — make the smallest orchestration change preserving mandatory wakeups.
6. **Measure again** — rerun comparable workload and analyzer.
7. **Verify** — independent investigator confirms lower overhead, task success, and liveness.

## Responsible agent
Host implementation agent changes orchestration; Trace Performance Investigator performs independent verification.

## Tools
`scripts/polling_trace_analyzer.py`, task tests/benchmarks, host status/event API.

## Outputs
Baseline report, candidate report, change record, verification verdict.

## Checkpoints
Baseline before change; event classes mapped before suppression; candidate metrics after change; independent verification before completion.

## Metrics
Polling-turn ratio, polling-token ratio, max no-progress polls, model turns/task, tokens/task, p95 task latency, wakeup delay, task success.

## Retry policy
Maximum two remediation cycles; each must test a different diagnosed cause or materially different mechanism.

## Stop conditions
No reliable state-change signal; missed completion/error/approval wakeup; success regression; wakeup-delay breach; no measurable improvement after two cycles.

## Failure path
Roll back the optimization, preserve baseline telemetry, use conservative bounded polling, and escalate the missing scheduler/lifecycle capability.

## Verification
Run `hooks/post-run-polling-regression.md` plus task-specific correctness tests.

## Definition of Done
Baseline exists; selected cause is evidence-backed; candidate reduces configured polling overhead or model turns; task success is unchanged or better; mandatory wakeups pass; limits are met; independent verifier returns PASS.