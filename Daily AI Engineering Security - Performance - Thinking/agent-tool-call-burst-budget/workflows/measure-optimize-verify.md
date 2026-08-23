# Workflow — Measure, Optimize, Verify

## Trigger
Burst-cost or latency alert, agent regression, or planned runtime-control rollout.

## Goal
Reduce low-value tool-call bursts with measurable evidence and bounded recovery.

## Inputs
Baseline traces, task fixtures, budget config, acceptance criteria.

## Baseline
Run each representative fixture at least three times with existing controls and retain calls/turn, calls/minute, poll/retry ratio, estimated input tokens, latency, and success.

## Stages
1. **Observe** — collect traces and classify calls.
2. **Measure** — calculate baseline distributions.
3. **Diagnose** — identify burst, polling, retry, or fan-out source.
4. **Hypothesize** — choose one budget/classification change.
5. **Implement** — integrate deterministic pre-tool check.
6. **Measure again** — replay identical fixtures.
7. **Decision** — if metrics improve without correctness loss, continue; otherwise re-evaluate.
8. **Verify** — independent verifier reproduces metrics and reviews blocks.

## Responsible agent
Runtime implementer for stages 1–6; `subagents/performance-verifier.md` for stage 8.

## Tools
`scripts/burst_budget.py`, test runner, trace collector, existing observability platform.

## Outputs
Before/after metrics, decision logs, final config, verification result.

## Checkpoints
Baseline captured; hypothesis recorded; candidate metrics captured; all blocks reviewed; independent verification complete.

## Retry policy
Maximum two threshold/classification tuning retries. Each retry MUST change exactly one documented hypothesis or parameter group.

## Stop conditions
Stop on verification success, two failed tuning retries, missing baseline, or any security/correctness regression.

## Failure path
Restore previous configuration, preserve traces, record the failed hypothesis, and escalate to the runtime owner.

## Definition of Done
Waste metrics improve, task success is unchanged or better, false-positive critical blocks are zero, security controls are unchanged, and verifier status is `Verified`.
