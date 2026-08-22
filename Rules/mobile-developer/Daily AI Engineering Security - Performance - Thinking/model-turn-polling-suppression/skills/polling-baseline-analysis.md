# Skill: Polling Baseline Analysis

## Purpose
Measure how much agent orchestration work is spent on status/wait turns that produce no meaningful state change.

## Trigger
Before optimizing a multi-agent/background workflow, after a usage or latency regression, or when repeated wait/status calls are observed.

## Inputs
JSONL orchestration trace; task outcome; optional previous baseline; polling budget configuration.

## Preconditions
Events have timestamps and kinds. Model-turn events provide token/latency data when available. Poll events identify whether state changed.

## Required context
Task boundaries, agent/process identifiers, success criteria, and the host's supported wakeup mechanisms.

## Allowed tools
Read-only trace inspection, `scripts/polling_trace_analyzer.py`, benchmark/test runner, deterministic status APIs.

## Constraints
Do not infer hidden reasoning. Do not suppress user input, errors, completion, approval requests, or new tool output. Do not claim improvement without before/after measurements.

## Procedure
1. Capture an unoptimized representative trace.
2. Run the analyzer with `config/polling-budget.json`.
3. Separate useful model turns from polling-only turns.
4. Identify repeated polls with unchanged state and longest no-progress sequence.
5. Measure tokens, model turns, latency, wakeup delay, and task success.
6. Form one concrete hypothesis: event-driven wakeup, state-change gate, coalescing, adaptive backoff, or stale-lifecycle repair.
7. Apply one remediation and rerun the same workload.
8. Compare metrics and run task-quality verification.

## Decision points
- If polling ratios are below budget, stop unless latency evidence identifies a separate bottleneck.
- If the host supports event callbacks, prefer them to periodic model-mediated polling.
- Without events, retain a bounded liveness checkpoint and maximum backoff.
- If stale agent state is detected, repair lifecycle handling before tuning cadence.

## Expected output
Machine-readable baseline/after reports plus a short evidence record identifying cause, hypothesis, change, and verdict.

## Metrics
Polling-turn ratio, polling-token ratio, consecutive no-progress polls, model turns/task, tokens/task, p95 completion latency, wakeup delay, success rate.

## Verification
Use identical or comparable workloads and assert no task-quality regression and no missed completion/error wakeups.

## Failure handling
At most two remediation attempts. Restore the previous orchestration policy if success rate drops or wakeup delay breaches the configured limit.

## Stop conditions
Stop after two failed hypotheses, missing reliable state-change signals, or any correctness/liveness regression that cannot be bounded.