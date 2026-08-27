# Skill: Compaction Thrash Analysis

## Purpose
Diagnose repeated context compaction and token waste using observable telemetry rather than intuition.

## Trigger
Use when compactions occur repeatedly, cache creation spikes, context refills immediately after compaction, or a long-running agent stalls despite large token spend.

## Inputs
JSONL trace compatible with `scripts/compaction_guard.py`, runtime context-window size, current task acceptance criteria, and known static prompt/tool/agent payloads.

## Preconditions
Telemetry must distinguish live context, reported usage, cache read/create tokens, static payload size, turns, and compaction events.

## Required context
Task-critical requirements, security constraints, unresolved evidence, and checkpoint state MUST remain available during optimization.

## Allowed tools
Read-only trace inspection, token counters, cache metrics, repository search, benchmark scripts.

## Constraints
Do not remove correctness-critical context merely to lower token usage. Do not claim an improvement without before/after measurements.

## Procedure
1. Capture a baseline trace spanning at least one compaction or representative long turn sequence.
2. Run the guard and record violations.
3. Separate static/repeated context from dynamic task state.
4. Compare reported context with live context; flag accounting divergence.
5. Measure cache-read and cache-creation ratios.
6. Form one falsifiable hypothesis: e.g. static registry reattachment causes post-compaction refill.
7. Apply one bounded change such as lazy-loading static registries, deduplicating tool schemas, or fixing usage accounting.
8. Re-run the same workload and compare metrics.
9. Require independent verification that no critical context was lost.

## Decision points
- `allow`: continue.
- `defer-and-trim`: remove only proven redundant/reloadable context, then remeasure.
- `stop-and-recover`: stop automatic retries and transfer verified state into a clean session/workflow.

## Expected output
Facts, baseline metrics, hypothesis, intervention, after-metrics, retained-context checklist, verification status.

## Metrics
Tokens/task, compactions/100 turns, minimum compaction gap, p95 input tokens, repeated-static tokens, cache-read ratio, cache-creation ratio, progress events.

## Verification
A separate verifier confirms the same task result and required context are preserved while metrics improve.

## Failure handling
Maximum two optimization attempts. If neither produces measurable improvement, stop and escalate the runtime defect or recover into a fresh session.

## Stop conditions
Stop immediately if context trimming would remove security policy, user constraints, unresolved evidence, or state required for a safe action.