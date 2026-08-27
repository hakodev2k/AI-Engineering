# Workflow — Measure, Diagnose, Optimize Retry Behavior

## Trigger
Repeated dependency failures, elevated tool/model call counts, retry storms, or retry-policy changes.

## Goal
Reduce retry amplification without reducing successful recovery from transient failures.

## Inputs
Request traces, endpoint/error classification, idempotency metadata, retry configuration, latency and call-count metrics.

## Baseline
Measure original attempts, retry attempts, retries/task, retry amplification factor `(original + retries) / original`, p50/p95 task latency, recovered-transient-request rate, duplicate-side-effect count, and circuit-open events.

## Context
Inspect orchestration, SDK, connector, auth, and subagent layers to identify every component that can retry the same logical operation.

## Stages
1. **Observe:** capture representative normal, transient-failure, throttling, and persistent-failure traces.
2. **Measure baseline:** record the metrics above before changing behavior.
3. **Diagnose:** map retry ownership and detect layered retries or budget resets.
4. **Form hypothesis:** state which retry layer or error class causes excess amplification.
5. **Implement improvement:** apply task-wide budget, per-operation limit, idempotency gate, jitter/backoff, and/or circuit threshold.
6. **Measure again:** replay the same synthetic failure set.
7. **Improved?** If no, revise the hypothesis at most twice. If yes, continue.
8. **Independent verification:** Performance Verifier checks before/after evidence and side-effect safety.

## Responsible agent
Implementation owner for stages 1–7; `subagents/performance-verifier.md` for final verification.

## Tools
Structured logs, `scripts/retry_guard.py`, unit tests, controlled synthetic failures.

## Outputs
Baseline/candidate metric table, retry-policy decision, guard configuration, verification status.

## Checkpoints
After baseline, before altering retry ownership, after candidate measurement, before release.

## Metrics
Retry amplification factor, retries/task, p95 latency, recovered-transient rate, circuit-open rate, duplicate-side-effect count.

## Retry policy
Maximum 2 optimization iterations. The workflow itself MUST NOT retry indefinitely.

## Stop conditions
No baseline, unknown idempotency for side-effecting calls, unresolved layered retry ownership, duplicate side effects, or exhausted optimization iterations.

## Failure path
Restore the last verified policy and escalate with traces and reason codes.

## Verification
Run `python -m unittest tests/test_retry_guard.py` and compare baseline versus candidate traces using identical failure scenarios.

## Definition of Done
Implemented: shared budget is enforced. Measured: before/after traces exist. Verified: lower bounded amplification with no loss of required correctness or duplicate side effects.
