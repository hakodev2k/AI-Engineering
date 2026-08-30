# Workflow: Measure → Tune → Verify

## Trigger
Timeout/stall failures, exact-threshold abort clustering, runaway retries, or large token/cost waste after resume.

## Goal
Reduce false aborts and retry amplification while preserving bounded detection of true stalls.

## Inputs
Historical run traces, timer configuration, model/effort/context cohorts, retry/token/cache counters, true-stall fixtures.

## Baseline
Run `scripts/watchdog_profiler.py` before any policy change. Record completion rate, false-abort candidates, p95/p99 phase latency, retry amplification, and tokens/task.

## Context
Silence can mean slow reasoning, blocked transport, retry backoff, live tool work, or a real stall. Timer policy must use observable phase evidence.

## Stages
1. **Observe** — collect complete timer and progress telemetry.
2. **Measure baseline** — cohort successful and failed durations.
3. **Diagnose** — identify false-abort cluster, timeout precedence, missing heartbeat, or retry loop.
4. **Form hypothesis** — one falsifiable policy change.
5. **Implement improvement** — adjust phase budget/heartbeat/reconnect/retry cap without removing bounded failure detection.
6. **Measure again** — replay comparable corpus.
7. **Improved?** — if no, allow one re-evaluation; maximum 2 tuning cycles.
8. **Verify** — independent agent tests true-stall fixtures and cost limits.

## Responsible agent
`subagents/performance-investigator.md` diagnoses; implementation owner changes policy; `subagents/verification-agent.md` verifies.

## Tools
Profiler, benchmark/replay harness, trace store, standard test runner.

## Outputs
Before/after reports, effective-timeout map, policy diff, regression evidence.

## Checkpoints
Baseline archived; cohort definitions fixed; retry/idempotency risk reviewed; after corpus comparable; independent verification completed.

## Metrics
False-abort rate, completion rate, p95/p99 phase latency, time-to-detect true stalls, retries/task, token multiplier, cache loss, duplicate side effects.

## Retry policy
At most 2 tuning cycles; at most the configured runtime retry count. Never retry indefinitely.

## Stop conditions
Stop if evidence cannot distinguish slow vs stuck, retry cost exceeds budget, duplicate side effects occur, or a proposed change removes all effective watchdog bounds.

## Failure path
Restore last known-good bounded policy, preserve traces, mark the cohort unsupported, escalate timer-precedence or transport defects.

## Verification
Improvement requires measurable reduction in false abort/retry waste with true-stall detection still bounded and representative completion quality unchanged or better.

## Definition of Done
Baseline captured, root cause supported, policy implemented, metrics recollected, before/after comparison complete, retry budget enforced, true-stall fixtures pass, independent verifier approves, no blocking regression remains.
