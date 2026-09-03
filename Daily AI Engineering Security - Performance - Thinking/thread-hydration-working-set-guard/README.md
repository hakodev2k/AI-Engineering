# Thread Hydration Working-Set Guard

## Topic
Bounded hydration of long-lived AI-agent threads.

## Category
Performance

## Problem
Persisted agent histories can grow to tens or hundreds of thousands of rollout items. Reopening them may eagerly parse, serialize, retain, render, or auto-resume more history than the active task needs, producing multi-second/minute resume latency, multi-gigabyte memory growth, and queue starvation.

## Evidence
See `evidence/research.md`. Current public reports from Codex in August 2026 show high app-server RSS during thread hydration, effectively quadratic `thread/resume` behavior, queue blocking, and version-sensitive paginated resume paths.

## Existing approach
Full history persistence plus automatic resume; model-context compaction; partial introduction of pagination/windowing; renderer virtualization in some clients.

## Existing limitations
Model compaction does not shrink persisted/UI history. Pagination can be version-sensitive. UI virtualization does not bound backend parsing. Eager resume can perform O(full history) work before the user needs the thread.

## Proposed improvement
Treat hydration as a measurable bounded operation. Establish working-set, latency, and concurrency budgets; prefer lazy resume and pagination/windowing; test client/server capability compatibility; and block performance claims without before/after telemetry.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, gap, root causes.
- `config/policy.json` — default measurable budgets.
- `skills/hydration-baseline-and-diagnosis.md` — evidence-driven investigation procedure.
- `rules/thread-hydration-budget.md` — enforceable runtime/engineering rules.
- `subagents/performance-investigator.md` — non-implementing diagnosis role.
- `workflows/measure-optimize-verify.md` — bounded Measure → Diagnose → Optimize → Measure flow.
- `hooks/pre-resume-budget-check.md` — blocking verification hook.
- `scripts/hydration_profiler.py` — dependency-free telemetry budget checker.
- `tests/test_hydration_profiler.py` — deterministic regression tests.

## Actual package tree
```text
thread-hydration-working-set-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-resume-budget-check.md
├── rules/thread-hydration-budget.md
├── scripts/hydration_profiler.py
├── skills/hydration-baseline-and-diagnosis.md
├── subagents/performance-investigator.md
├── tests/test_hydration_profiler.py
└── workflows/measure-optimize-verify.md
```

## Installation
Requires Python 3.9+ for the reference profiler/tests. The docs are runtime-agnostic.

## Configuration
Tune `config/policy.json` to your host and product SLO. Do not increase thresholds solely to make a regression pass. The defaults are conservative reference values, not universal vendor guarantees.

## Usage
Telemetry is JSONL. Emit `resume_start` and `resume_end` records. Each `resume_end` requires `thread_id`, `resume_ms`, `rss_mb`, and `loaded_items`.

```bash
python scripts/hydration_profiler.py --telemetry candidate.jsonl --policy config/policy.json --json
python -m unittest tests/test_hydration_profiler.py
```

Exit codes: `0` pass, `1` measured budget violation, `2` invalid input/runtime error.

## Workflow
Observe → measure baseline → diagnose dominant cost → form one hypothesis → implement → measure identical fixtures → re-evaluate for at most 3 attempts → independent verify.

## Metrics
p95 resume latency, peak RSS, loaded items, concurrent hydrations, CPU time, and unrelated-request queue wait.

## Verification
A performance improvement is **Implemented** when the bounded hydration mechanism exists; **Measured** when before/after telemetry is captured on comparable fixtures; **Verified** only when candidate telemetry passes policy, regression tests pass, unrelated requests remain responsive, and required active state/history remains available.

## Safety
Never delete authoritative history or suppress required context merely to reduce memory. Fail to lazy/read-only access when pagination capability is incompatible rather than silently loading the entire history.

## Failure handling
Detection: policy violation or correctness regression. Evidence: raw telemetry and failing fixture. Retry policy: maximum 3 materially different hypotheses. Fallback: revert candidate and retain existing safe path. Escalation: provide baseline/candidate metrics plus bottleneck evidence. Stop condition: policy passes with correctness or retries are exhausted.

## Definition of Done
- Current evidence documented.
- Baseline captured before optimization.
- Root cause and one hypothesis documented.
- Candidate implementation measured on identical fixtures.
- Profiler and unit tests pass.
- Pagination/version compatibility verified where used.
- No required history/state loss.
- Independent verification complete.
- No blocking issue remains.

## Customization
Adapters may add CPU, disk I/O, queue wait, renderer heap, or per-stage timings while keeping the same bounded-working-set invariant.
