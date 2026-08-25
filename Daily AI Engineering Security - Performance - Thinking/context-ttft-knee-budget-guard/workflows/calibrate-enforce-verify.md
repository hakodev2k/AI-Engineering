# Workflow: Calibrate, Enforce, Verify

## Trigger
Measured long-session latency or context-policy change.

## Goal
Reduce tokens/latency without critical context loss.

## Inputs
Request telemetry, budget config, representative task suite.

## Baseline
Capture current p95 TTFT, tokens/task, cache ratio, and task success/regression rate.

## Context
Follow `../skills/calibrate-context-latency-budget.md` and `../rules/token-budget-rules.md`.

## Stages
1. Observe — identify slow model requests, not aggregate tool time.
2. Measure baseline — capture token/TTFT telemetry and task quality.
3. Diagnose — bin by model/workload and locate a supported latency knee.
4. Form hypothesis — predict a budget that lowers p95 TTFT.
5. Implement improvement — soft gate plus safe compaction/retrieval/thread handoff.
6. Measure again — same task suite.
7. Improved? If no, revise once; maximum 2 calibration iterations. If yes, continue.
8. Verify — independent review checks latency and quality evidence.

## Responsible agent
Context Performance Analyst; independent verifier for final stage.

## Tools
`python scripts/ttft_knee.py telemetry.jsonl --config config/budget.json`

## Outputs
Baseline report, budget report, quality comparison, verification decision.

## Checkpoints
Timing validity; sufficient samples; budget derived; quality preserved; final gate pass.

## Metrics
p95 TTFT, tokens/task, cache ratio, cost/task where available, task success/regression rate.

## Retry policy
At most two budget changes per calibration cycle.

## Stop conditions
Invalid TTFT telemetry, insufficient samples, material quality regression, or two failed iterations.

## Failure path
Restore prior context policy, retain evidence, escalate observability or model/provider investigation.

## Verification
Independent verifier confirms latency improvement is reproducible and required context was not removed.

## Definition of Done
Implemented: analyzer and gate exist. Measured: before/after metrics captured. Verified: p95 TTFT improves while task-quality regression remains within approved tolerance.
