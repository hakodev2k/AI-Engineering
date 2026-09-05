# Skill: Compaction Effectiveness Analysis

## Purpose
Determine whether a context compaction materially relieved token pressure and whether monitoring state stayed correct afterward.

## Trigger
Compaction event, repeated compaction, context overflow, unexpected summary cost, or post-compaction context rebound.

## Inputs
Context capacity; tokens before/after; reserved tokens; compaction timestamp/turn; summary size if available; next-turn token state; static/bootstrap token estimate.

## Preconditions
Token metrics must identify what they measure. Do not compare cumulative usage against active prompt size.

## Required context
Configured context window, retention policy and compaction trigger.

## Allowed tools
Agent logs, provider usage metadata, tokenizer estimates, trace replay, `compaction_watchdog.py`.

## Constraints
Do not remove required context solely to meet a metric. Do not trigger destructive resets during diagnosis without approval.

## Procedure
1. Capture baseline compaction events from a representative workload.
2. For each event calculate reclaimed tokens and reclaim ratio.
3. Calculate post-compaction utilization against usable capacity.
4. Compare next-turn context state to `tokens_after`; flag unexplained rebound.
5. Detect compactions separated by too few turns with insufficient intervening growth.
6. Partition context into static/bootstrap, retained recent turns, summary, dynamic tool output and other injected context where evidence permits.
7. Form a root-cause hypothesis: no-op rotation, stale accounting, non-reclaimable static context, summary bloat, trigger mismeasurement, or retention bug.
8. Implement one targeted correction.
9. Replay the same workload and compare compactions/task, tokens/task, latency and quality.
10. Independent reviewer verifies both token reduction and no critical context loss.

## Decision points
Reclaim ratio below policy = ineffective. Immediate rebound without new input = accounting/state fault. Effective reclaim but quality regression = reject optimization.

## Expected output
Baseline, event metrics, root cause, before/after comparison, verification status.

## Metrics
Reclaim ratio; post utilization; compaction frequency; tokens/task; latency/task; quality and regression rate.

## Verification
Same workload must show postcondition compliance and no critical context loss.

## Failure handling
One token recount retry; one remediation replay. Persisting failure stops automatic retry.

## Stop conditions
Stop on repeated ineffective compaction, unknown token semantics, or evidence of user/task state loss.