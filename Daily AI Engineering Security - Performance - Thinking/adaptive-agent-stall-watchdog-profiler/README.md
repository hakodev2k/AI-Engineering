# Adaptive Agent Stall Watchdog Profiler

**Category:** Performance  
**Run date:** 2026-08-31 (UTC+7)

## Problem
Fixed no-progress timeouts can abort slow-but-healthy model/agent work, then trigger expensive resumes or restarts. The same symptom can also come from real stream faults, nested timeout precedence, or a genuinely stuck task, so simply raising one timeout is not a reliable fix.

## Evidence
See `evidence/research.md`. Current signals include August 2026 reports from Claude Code where 600-second watchdogs killed resumable/active work, a workflow retry loop that burned roughly 580k tokens, OpenClaw timer-precedence behavior that pre-empted configured provider timeouts, and Hermes Agent restart loops on slow large-context local inference.

## Existing approach
Static timeout increases, retries/resume, provider-specific timeouts, global stuck-session watchdogs, and transport heartbeats.

## Existing limitations
Flat timers cannot distinguish heterogeneous phases. Multiple timer layers can shadow each other. Retries can duplicate cost or side effects. Heartbeats prove some liveness but not necessarily semantic progress.

## Proposed improvement
Measure phase-level latency and outcomes first, classify false-abort candidates, expose effective timer precedence, enforce retry/token amplification budgets, and tune bounded phase-specific watchdog behavior only after a reproducible baseline.

## Architecture
- `evidence/research.md` — current public evidence and root-cause analysis.
- `skills/stall-diagnosis.md` — evidence-driven diagnostic procedure.
- `rules/watchdog-rules.md` — enforceable performance invariants.
- `subagents/performance-investigator.md` — diagnosis role.
- `subagents/verification-agent.md` — independent verifier.
- `workflows/measure-tune-verify.md` — bounded optimization workflow.
- `hooks/preflight-latency-baseline.md` — blocks tuning without baseline.
- `scripts/watchdog_profiler.py` — deterministic trace profiler.
- `tests/test_watchdog_profiler.py` — regression tests.
- `config/watchdog.example.json` — example bounded policy.

## Actual package tree
```text
README.md
config/watchdog.example.json
evidence/research.md
hooks/preflight-latency-baseline.md
rules/watchdog-rules.md
scripts/watchdog_profiler.py
skills/stall-diagnosis.md
subagents/performance-investigator.md
subagents/verification-agent.md
tests/test_watchdog_profiler.py
workflows/measure-tune-verify.md
```

## Installation
Python 3.10+; profiler and tests use only the standard library.

## Configuration
Copy `config/watchdog.example.json`. Set bounded phase timeouts, maximum retry count, token amplification ceiling, heartbeat grace, and minimum sample count. Do not encode credentials in config.

## Usage
```bash
python scripts/watchdog_profiler.py traces.jsonl --config config/watchdog.example.json --json-out baseline.json
python -m unittest tests/test_watchdog_profiler.py
```

Trace records include `run_id`, `phase`, `duration_seconds`, and `outcome`; optional fields include watchdog duration, retry count, token counters, cache-read tokens, and whether a timed-out run later resumed successfully.

## Workflow
Follow `workflows/measure-tune-verify.md`: **Measure → Diagnose → Hypothesize → Optimize → Measure again → independent verification**. At most two tuning cycles are allowed.

## Metrics
- false-abort candidate rate
- completion rate
- successful-resume-after-timeout rate
- p50/p95/p99 phase latency
- retries/task and duplicated work
- tokens/task and retry token multiplier
- cache loss after retry/resume
- time-to-detect true stalls

## Verification
**Implemented:** profiler, policy rules, bounded workflow, tests.  
**Measured:** representative before/after traces from the same workload cohorts.  
**Verified:** false-abort/retry waste decreases while true-stall detection remains bounded and completion quality does not regress.

## Safety
Never remove all watchdogs. Never use unbounded retries. Effect-bearing tool calls require idempotency/deduplication before automatic replay. Do not trade security boundaries or correctness for lower latency.

## Failure handling
Detection: healthy p99 reaches the watchdog, exact-boundary aborts later resume successfully, retry/token budget is exceeded, or configured timeout is shadowed by another timer. Preserve traces, revert to the last known-good bounded policy, retry tuning at most twice, then escalate the timer/transport defect.

## Definition of Done
Evidence documented; baseline captured; existing limitations identified; root cause supported by traces; bounded improvement implemented; tests pass; metrics recollected; before/after comparison complete; retry budget enforced; true-stall fixtures remain bounded; independent verification passes; no blocking issue remains.

## Customization
Add provider/framework trace adapters as needed, but keep phase identity, outcome labels, effective watchdog values, retry counters, and token metrics comparable across versions so regression detection remains meaningful.
