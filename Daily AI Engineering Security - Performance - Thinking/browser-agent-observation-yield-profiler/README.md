# Browser Agent Observation Yield Profiler

**Category:** Performance

## Problem
Browser-assisted AI agents can spend large amounts of wall time and model/context budget repeatedly observing pages without proportional task progress. The browser itself may work correctly while the agent loop remains slow because screenshots, DOM/page state, navigation checks, model re-entry, retries, and repeated observations amplify one another.

## Evidence
Recent Codex reports provide a concrete cluster: issue #39066 (2026-08-17) reports browser tasks that are unusually laggy and token-heavy with many interactions but little progress; issue #37606 (2026-08-08) reports a fresh tool-heavy thread reaching 232k/258k context and compacting early; issue #40087 (2026-08-22) asks for per-tool timing that distinguishes actual tool execution from Codex overhead/waiting. See `evidence/research.md`.

## Existing approach and limitation
Current mitigations include compaction, truncation, lower reasoning effort, browser-tool retries, generic tool timing, and manual inspection. These do not directly measure whether repeated browser observations changed state or advanced the goal. A fast browser call can still be wasteful if it yields no new state, and a slow turn can be misattributed to the browser when most time is model/orchestration overhead.

## Proposed improvement
Instrument browser-agent traces with state fingerprints and explicit progress events. Measure observation yield, duplicate-state observation rate, tokens per progress unit, model/tool/overhead latency shares, and compact/re-observe behavior. Optimize only after a baseline and replay the same workload after changes.

## Package tree
```text
README.md
evidence/research.md
config/thresholds.example.json
skills/observation-yield-analysis.md
rules/performance-measurement.md
subagents/performance-verifier.md
workflows/benchmark-and-optimize.md
hooks/post-run-yield-check.md
scripts/browser_yield_profiler.py
tests/test_browser_yield_profiler.py
```

## Installation
Python 3.9+ only; no third-party dependencies.

## Trace format
JSONL with one event per line. Required fields: `type` and `ts_ms`. Browser observations use `type="observation"`, `state_hash`, optional `tokens` and `latency_ms`. Tool events may use `type="tool"`; model events `type="model"`; meaningful milestone events `type="progress"`; compaction events `type="compaction"`.

## Usage
```bash
python scripts/browser_yield_profiler.py trace.jsonl --thresholds config/thresholds.example.json
python -m unittest tests/test_browser_yield_profiler.py
```

## Workflow
Measure baseline → diagnose duplicate observations and latency attribution → form one hypothesis → optimize → replay same task → compare → independent verification. Maximum two optimization loops.

## Metrics
- observation count and unique state count
- duplicate-state observation rate
- observations per progress event
- tokens per progress event
- model/tool/unattributed latency totals
- compaction count and observations immediately following compaction

## Verification
**Implemented** means trace instrumentation and profiler are wired into the workload. **Measured** means baseline and post-change profiles exist for the same benchmark. **Verified** means latency or interaction count improves without reducing task-success/verification quality, and duplicate observation rate does not regress.

## Safety
Do not disable security prompts, approvals, page validation, or required correctness checks to improve yield. State hashes SHOULD be derived from normalized non-secret browser state; raw page content need not be stored.

## Failure handling
Invalid traces fail with non-zero exit. If the workload is nondeterministic, run at least three samples and compare medians. Maximum two hypothesis cycles; unresolved regressions stop optimization and preserve the safer baseline.

## Definition of Done
Current evidence recorded; repeatable baseline captured; bottleneck classified; one change implemented; same workload re-measured; task success preserved; performance metrics improved; regression tests pass; independent verifier signs off.

## Customization
Map framework-specific events into the minimal JSONL schema. Add domain-specific progress markers such as page target reached, assertion passed, form submitted, or UI state verified.