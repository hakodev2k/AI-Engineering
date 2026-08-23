# Browser Observation Context Budget Guard

**Category:** Token

## Problem
Browser-enabled agents can consume disproportionate context on repeated DOM snapshots, screenshots, locator dumps, and page-state observations. The cost compounds across long workflows and can cause early compaction, quota exhaustion, high latency, and incomplete tasks.

## Evidence
See `evidence/research.md`. Current public signals include OpenAI Codex issues #39066, #32303, and #30665 plus recent Playwright-MCP token analysis.

## Existing approach and limitation
Compaction, generic truncation, prompt instructions, and screenshot compression are mostly reactive or coarse. They do not attribute cost per browser observation or prevent repeated unchanged full-page state from being admitted.

## Proposed improvement
Measure every observation, fingerprint duplicates, enforce per-event and per-task budgets, prefer targeted/delta observations, avoid redundant modalities, and permit explicit full-view budget escalation when correctness requires it.

## Architecture
- `evidence/research.md` — evidence, current approaches, gaps, root causes.
- `skills/analyze-browser-observation-budget.md` — measurement/optimization procedure.
- `rules/browser-observation-budget.md` — observable token-budget rules.
- `subagents/browser-budget-verifier.md` — independent verification role.
- `workflows/measure-optimize-verify.md` — bounded measure/diagnose/optimize/re-measure loop.
- `hooks/pre-context-browser-observation.md` — context-admission integration point.
- `scripts/observation_budget.py` — dependency-free JSONL profiler/admission recommender.
- `tests/test_observation_budget.py` — duplicate, over-budget, and required-full regression cases.

## Installation
Python 3.9+; no third-party dependencies.

## Configuration
Default profiler budgets are 50,000 bytes/event and 250,000 bytes/task with a documented 4 bytes/token estimate. Hosts SHOULD replace the estimate with provider tokenizer telemetry when available and tune budgets from measured representative workloads.

## Usage
Pipe browser observation events as JSONL:

`python3 scripts/observation_budget.py --event-byte-budget 50000 --task-byte-budget 250000 < observations.jsonl`

Each event accepts `type`, `page`, `content` or `bytes`, and optional `required_full`.

## Workflow
Observe → measure baseline → diagnose largest/duplicate observations → form one optimization hypothesis → optimize → measure again → compare → independent verification → complete or rollback.

## Metrics
Observation tokens/task; browser-output share of context; duplicate ratio; p50/p95 observation size; full snapshot count; compaction count; latency; task completion; quality regression rate.

## Verification
Run `python3 tests/test_observation_budget.py`. The duplicate fixture must be reusable, the oversized non-required observation must request targeting/delta, and the required full observation must remain admitted through an explicit budget escalation.

## Safety
Never discard task-critical authentication state, target identity, success/failure evidence, or safety-relevant page state merely to save tokens. A smaller prompt is not an improvement when the task becomes less correct.

## Failure handling
Detection: profiler failure, over-budget trace, duplicate amplification, or quality regression. Evidence: trace/report and before/after metrics. Retry: maximum three distinct hypotheses. Fallback: normal full observation admission when measurement is unavailable. Escalation: tool/runtime owner if full observations are mandatory and structurally too large. Stop condition: target met, three failed hypotheses, or correctness requires the original context.

## Definition of Done
- **Implemented:** profiler, hook, rules, workflow, verifier, and tests exist.
- **Measured:** a representative baseline and optimized replay record context, latency, and quality metrics.
- **Verified:** observation volume decreases measurably, required full evidence is retained, tests pass, and no task-quality regression is observed.

## Customization
Add page-specific targeting rules, provider tokenizers, observation TTLs, or browser-tool adapters. Preserve the `required_full` escape hatch and independent quality verification.
