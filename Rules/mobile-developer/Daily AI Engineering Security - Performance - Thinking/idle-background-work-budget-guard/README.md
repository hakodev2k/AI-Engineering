# Idle Background Work Budget Guard

**Category:** Performance  
**Run date:** 2026-08-20 (UTC+7)

## Problem
Desktop agent clients can keep doing expensive local work after foreground tasks stop. Reconciliation, history/index scans, polling, Git inspection, SQLite/log maintenance, and renderer/main-process loops can consume one or more logical cores, grow memory, or generate enough I/O to make the developer machine stutter or freeze.

## Evidence
See `evidence/research.md`. Recent and recurring Codex Windows reports show sustained idle CPU, system-wide pointer stutter, and large-state startup paths that can exhaust CPU/RAM.

## Existing approach
OS scheduling, generic Electron throttling, ad-hoc debounce/poll intervals, manual minimize/restart, and selected lazy-loading or compaction mechanisms.

## Existing limitations
These mechanisms do not provide a product-level contract for how much resource non-user-visible jobs may consume, who owns them, whether they overlap, or when they must defer/cancel. Total-system CPU can also hide one-core saturation on many-core machines.

## Proposed improvement
Register every recurring/background job with ownership, trigger, idle eligibility, minimum interval, cancellation semantics, and resource budgets. Measure idle resource deltas in normalized units, attribute repeated breaches to jobs, and enter bounded defer/cancel/recovery rather than endlessly rerunning heavy maintenance.

## Architecture
- `skills/background-work-investigation.md` — Measure/diagnose/optimize procedure.
- `rules/background-budget-rules.md` — enforceable scheduling and safety rules.
- `subagents/performance-verifier.md` — independent benchmark verifier.
- `workflows/measure-bound-verify.md` — bounded optimization workflow.
- `hooks/idle-budget-check.md` — deterministic regression gate.
- `scripts/idle_budget_analyzer.py` — CSV resource-budget analyzer.
- `tests/test_idle_budget_analyzer.py` — analyzer regression tests.
- `evidence/research.md` — public evidence and root-cause analysis.

## Package tree
```text
README.md
evidence/research.md
skills/background-work-investigation.md
rules/background-budget-rules.md
subagents/performance-verifier.md
workflows/measure-bound-verify.md
hooks/idle-budget-check.md
scripts/idle_budget_analyzer.py
tests/test_idle_budget_analyzer.py
```

## Installation
Python 3.10+; no third-party package required. Your host application or OS sampler must emit cumulative snapshots using:

`timestamp_s,cpu_seconds,rss_bytes,read_bytes,write_bytes`

## Usage
```bash
python3 scripts/idle_budget_analyzer.py samples.csv \
  --max-core-seconds-per-minute 12 \
  --max-rss-growth-mb-per-minute 50 \
  --max-io-mb-per-minute 100
python3 -m unittest tests/test_idle_budget_analyzer.py
```
Example thresholds are not universal SLOs. Calibrate them using product/device baselines and keep the same thresholds in before/after comparisons.

## Workflow
Measure a reproducible idle baseline → diagnose the highest-cost owned job → form one hypothesis → apply one bounded scheduling/incremental-work improvement → measure the identical scenario again → independent verification. Maximum two remediation attempts per offender.

## Metrics
Core-seconds/minute, RSS growth MB/minute, I/O MB/minute, job duty cycle, overlap count, repeated unchanged scans, p95 job duration, breach count, UI/event-loop delay when available, and maintenance correctness pass rate.

## Verification
Performance improvement requires measured before/after evidence. The verifier must reproduce the same idle state and workload size and run required maintenance correctness tests. Lower CPU alone is not success if synchronization, integrity, or security work stops functioning.

## Safety
Never kill an unknown process or cancel a job without known ownership and cancellation semantics. Never disable integrity/security work solely to pass a performance budget. Prefer incremental scans, watermarks, debouncing, backoff, and deferral. Human approval is required before disabling required maintenance behavior.

## Failure handling
Detection: hook exit 3 or equivalent runtime breach. Evidence: telemetry CSV and offender/job events. Retry: at most two changed remediation attempts. Fallback: restore safe scheduling and defer explicitly optional work. Escalation: owner review for unknown/unbounded jobs. Stop on correctness regression, unsafe cancellation, or repeated no-improvement.

## Implemented / Measured / Verified
**Implemented** means job budgets and lifecycle hooks exist. **Measured** means before/after idle traces were captured. **Verified** means independent benchmark plus correctness tests pass. Do not claim performance improvement without the latter two states.

## Definition of Done
Evidence documented; baseline captured; offender/root cause identified; optimization implemented; before/after comparison completed; configured budgets pass; maintenance correctness tests pass; independent verifier passes; no security/integrity requirement was weakened; no blocking issue remains.

## Customization
Extend telemetry with `job_id`, event-loop delay, per-job CPU attribution, disk queue, or platform-specific counters. Keep the analyzer input cumulative and monotonic so comparisons remain deterministic.