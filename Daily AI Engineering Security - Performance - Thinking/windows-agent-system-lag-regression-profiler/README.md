# Windows Agent System-Lag Regression Profiler

## Topic
Baseline-first profiling of system-wide Windows input/UI degradation correlated with desktop AI-agent runtimes.

## Category
Performance

## Problem
Desktop agent activity can externalize performance cost to the entire workstation. Mouse/input stalls, DWM/composition load, high I/O, helper leaks, renderer growth, or polling can make Windows sluggish even when task-level agent latency looks acceptable.

## Evidence
See `evidence/research.md`. Multiple independent Codex reports from August 14–19, 2026 describe repeatable system-wide lag, including a measured ~50x input-stall increase, high I/O, sustained renderer/GPU load, persistent helper workers, and feature/app-disable recovery.

## Existing approach
Task Manager screenshots, subjective cursor tests, ad-hoc Process Explorer/WPR traces, restarts, feature toggles, or rollback.

## Existing limitations
Snapshots lack time correlation and matched controls; the desktop process tree is multi-process; different builds may have different root causes; correlation is often promoted to causation too early.

## Proposed improvement
Collect read-only process metrics under labeled baseline/current scenarios, analyze p95 ratios against policy, rank abnormal dimensions, then use bounded discriminating A/B experiments before deeper ETW/WPR tracing or implementation.

## Architecture
- `scripts/collect_agent_process_metrics.ps1`: safe Windows sampler.
- `scripts/analyze_regression.py`: dependency-free analyzer/gate.
- `config/regression-policy.json`: thresholds and minimum samples.
- `skills/windows-system-lag-triage.md`: reusable diagnosis skill.
- `rules/performance-rules.md`: enforceable measurement constraints.
- `subagents/performance-verifier.md`: independent verification.
- `workflows/measure-diagnose-optimize.md`: primary bounded workflow.
- `workflows/failure-recovery.md`: recovery/escalation.
- `hooks/pre-regression-claim.md`: deterministic completion gate.
- `tests/test_analyze_regression.py`: analyzer tests.
- `evidence/research.md`: current public evidence.

## Actual package tree
```text
windows-agent-system-lag-regression-profiler/
├── README.md
├── config/regression-policy.json
├── evidence/research.md
├── hooks/pre-regression-claim.md
├── rules/performance-rules.md
├── scripts/
│   ├── analyze_regression.py
│   └── collect_agent_process_metrics.ps1
├── skills/windows-system-lag-triage.md
├── subagents/performance-verifier.md
├── tests/test_analyze_regression.py
└── workflows/
    ├── failure-recovery.md
    └── measure-diagnose-optimize.md
```

## Installation
Windows PowerShell 5.1+ or PowerShell 7+ for collection; Python 3.10+ for analysis; no third-party Python packages.

## Configuration
Tune thresholds only from healthy representative baselines. `input_stall_ms` is optional and may be filled from WPR/ETW or another trusted latency source; the collector leaves it blank rather than inventing a value.

## Usage
Collect a baseline:
`powershell -File scripts/collect_agent_process_metrics.ps1 -ProcessName ChatGPT -Scenario baseline -Output baseline.csv -Samples 30`

Collect affected/current scenario:
`powershell -File scripts/collect_agent_process_metrics.ps1 -ProcessName ChatGPT -Scenario active -Output current.csv -Samples 30`

Analyze:
`python3 scripts/analyze_regression.py baseline.csv current.csv --policy config/regression-policy.json --output report.json`

Exit codes: `0 pass`, `2 measured regression or insufficient evidence`, `3 invalid input`.

## Workflow
Measure baseline → measure affected state → diagnose dominant resource dimension → at most three hypotheses → reversible discriminating experiment → implement → measure again → verify.

## Metrics
p50/p95 CPU, read/write MB/s, working set, handles, threads, optional input-stall ms; process count; recovery ratio; adjacent regressions.

## Verification
**Implemented:** collector, analyzer, policy, tests, rules, and workflows exist. **Measured:** representative baseline/current CSVs are captured. **Verified:** analyzer passes after the fix, correctness/security remain unchanged, and the independent verifier accepts the matched experiment.

Run `python3 -m unittest tests/test_analyze_regression.py`.

## Safety
Collection is read-only and intentionally excludes environment variables, command lines, file contents, and secrets. Do not alter drivers, registry security, permissions, sandbox policy, or user data automatically.

## Failure handling
Bad collection is retried once. Hypothesis tests are capped at three and implementations at two. Preserve evidence and escalate to WPR/WPA/runtime owners rather than weakening thresholds or security.

## Definition of Done
Evidence documented; matched baseline/current captured; enough samples exist; dominant measured dimension identified; fix targets supported layer; after-run passes policy; tests pass; no correctness/security regression; independent verification complete; no blocking issue remains.

## Customization
Add trusted ETW/WPR-derived input-stall columns or vendor-specific process names. Keep baseline comparability and read-only collection mandatory.
