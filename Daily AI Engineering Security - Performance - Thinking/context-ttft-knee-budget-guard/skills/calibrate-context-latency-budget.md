# Skill: Calibrate Context Latency Budget

## Purpose
Derive a soft context-token budget from measured TTFT for a specific model/workload instead of using context-window capacity as a responsiveness proxy.

## Trigger
Long-session slowdown, model/client upgrade, changed compaction strategy, or recurring high TTFT.

## Inputs
JSONL request telemetry and `../config/budget.json`.

## Preconditions
Telemetry MUST separate model TTFT from tool execution and approval waiting. Otherwise calibration is invalid.

## Required context
Model identity, workload label, current context policy, multimodal presence.

## Allowed tools
Read-only telemetry extraction and `../scripts/ttft_knee.py`.

## Constraints
MUST NOT remove context required for correctness solely to save tokens. MUST preserve quality regression checks.

## Procedure
1. Collect input tokens, cached tokens, TTFT, model, workload.
2. Exclude invalid/incomplete requests and retain exclusions as evidence.
3. Analyze with the latency target and bin size.
4. Find the earliest sufficiently sampled bin whose p95 TTFT breaches target.
5. Apply the configured safety margin to derive a soft budget.
6. Add a pre-request warning/gate plus safe compaction, retrieval, or thread handoff.
7. Re-run representative tasks.
8. Compare TTFT, tokens/task, cost/task where available, and task quality.
9. Independently verify before production enforcement.

## Decision points
No knee: retain default budget and gather data. Low samples: do not enforce. Lower TTFT with quality regression: reject optimization. Different model/workload curves: keep separate budgets.

## Expected output
Latency curve, knee, recommended budget, enforcement decision, quality evidence.

## Metrics
TTFT p50/p95 by token bin; tokens/task; cache ratio; cost/task; quality/regression rate.

## Verification
Verified only when p95 TTFT improves on representative tasks without material correctness regression.

## Failure handling
If timing mixes model wait with tool/approval time, stop and repair observability first.

## Stop conditions
Maximum two budget-adjustment iterations per calibration cycle.
