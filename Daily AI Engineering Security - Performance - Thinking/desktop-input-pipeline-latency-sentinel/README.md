# Desktop Input Pipeline Latency Sentinel

**Category:** Performance

## Problem / Evidence
Desktop AI clients can degrade mouse/keyboard responsiveness across Windows without obvious resource saturation. August 2026 Codex reports provide multiple independent reproductions and direct event-delivery measurements. See `evidence/research.md`.

## Existing approach / Existing limitations
Task Manager, driver updates, GPU toggles and subjective testing can miss input-pipeline regressions because they measure utilization rather than event arrival. Workarounds do not produce regression gates or root-cause evidence.

## Proposed improvement / Architecture
Make system input delivery a release SLO: collect app-exited baseline, collect labeled affected state, analyze tail gaps, isolate one subsystem at a time, optimize, repeat and independently verify. Architecture: `GetCursorPos probe -> JSONL -> A/B analyzer -> pass/fail -> isolate -> remeasure`.

## Actual package tree
```text
README.md
config/thresholds.json
evidence/research.md
hooks/pre-release-latency-gate.md
rules/desktop-performance-regression.md
scripts/analyze_input_trace.py
scripts/input_latency_probe.py
skills/baseline-input-latency.md
subagents/performance-investigator.md
tests/test_analyze_input_trace.py
workflows/measure-isolate-optimize.md
```

## Installation / Configuration
Python 3.10+. Collector requires Windows; analyzer/tests are platform-independent and standard-library only. Calibrate `config/thresholds.json` on representative hardware; do not raise thresholds merely to make a failing build pass.

## Usage
Collect baseline: `python scripts/input_latency_probe.py baseline.jsonl --seconds 20 --label app-exited`. Collect affected: `python scripts/input_latency_probe.py affected.jsonl --seconds 20 --label thinking`. Compare: `python scripts/analyze_input_trace.py affected.jsonl --baseline baseline.jsonl`.

## Workflow / Metrics / Verification
Follow `workflows/measure-isolate-optimize.md`. Measure p95/p99/max gap, >8/16/32/64 ms rates, affected/baseline >16 ms ratio and repeatability. CPU/GPU/memory are supporting metrics only. Run `python -m pytest tests/test_analyze_input_trace.py`; real product verification requires Windows A/B traces because synthetic tests verify analyzer behavior only.

## Safety / Failure handling
Collector is read-only and records timing plus coordinates; it injects no input and requires no elevation. Stop if the system becomes unusable. Never disable security controls as a performance workaround. Detection: gate failure, insufficient events or inconsistent pairs. Retry: max 3 recollections per hypothesis. Fallback: revert candidate change/retain prior build. Escalate to desktop runtime owner.

## Implemented / Measured / Verified
Implemented means probe, analyzer, rules, workflow and tests exist. Measured means a real scenario has baseline and affected traces. Verified means repeated post-change A/B passes and an independent verifier reproduces improvement.

## Definition of Done
Evidence documented; baseline captured; regression quantified; hypothesis isolated; improvement implemented; before/after comparison passes; risks documented; independent verification complete; no blocking issue remains.
