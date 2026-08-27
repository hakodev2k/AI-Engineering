# Long-Session Context Cache Budget Controller

**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Long-running, tool-heavy agent sessions can repeatedly approach context limits, compact too late or resume nearly full, and lose prompt-cache reuse after large idle gaps or context mutations. The result can be repeated token processing, latency, cost, and reduced task reliability.

## Evidence
See `evidence/research.md` for current OpenAI Codex reports on stale usage before compaction, repeated compaction with little recovered runway, idle-session cache expiry, an Anthropic Claude Code report of large prompt-cache invalidations, and OpenAI's documented automatic compaction approach.

## Existing approach
Codex automatically compacts conversations after a token threshold; prompt caching reduces repeated prefix processing; developers can manually compact or start new sessions.

## Existing limitations
Static compaction thresholds may not account for newly appended tool output, recovered runway can be too small, cache expiry can make a tiny follow-up expensive, and heterogeneous runtimes expose different cache/token telemetry.

## Proposed improvement
A runtime-neutral budget controller computes projected next-request utilization from current context plus pending additions, enforces minimum post-compaction runway, and recommends checkpoint/compact/new-session actions before cache-expiry or overflow risk.

## Architecture / Actual package tree
```text
long-session-context-cache-budget-controller/
├── README.md
├── evidence/research.md
├── config/policy.json
├── scripts/context_budget_guard.py
├── tests/test_context_budget_guard.py
├── skills/context-budget-analysis.md
├── rules/context-cache-budget.md
├── subagents/context-verifier.md
├── workflows/measure-optimize.md
└── hooks/pre-request-budget-check.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Set the actual model context window, soft/hard utilization, safety margin, minimum runway, idle cache-risk interval, and minimum acceptable cache-read ratio in `config/policy.json`.

## Usage
`python scripts/context_budget_guard.py --state state.json --policy config/policy.json`

`state.json` must provide `current_context_tokens`, pending user/tool/retrieval tokens, `idle_seconds`, `cache_read_tokens`, and `cache_creation_tokens`.

## Workflow
Use `workflows/measure-optimize.md`: Observe → Measure baseline → Diagnose → Hypothesize → Budget decision → Optimize → Measure again → bounded retry → independent verification.

## Metrics
Tokens/request, tokens/task, projected utilization, post-compaction runway, cache-read ratio, cache-creation tokens, latency, compaction frequency, and task-quality regression rate.

## Verification
Run `python -m unittest tests/test_context_budget_guard.py` and task-specific regression tests after any checkpoint/compaction change.

## Safety
The controller never deletes context automatically. Required correctness/security context MUST be retained even if token savings decrease.

## Failure handling
Malformed/missing telemetry prevents an optimization claim and falls back to conservative `checkpoint_or_compact`. Maximum tuning retries: 2. Escalate if quality regresses or the runtime cannot expose adequate usage data.

## Definition of Done
**Implemented:** pre-request budget check is integrated.  
**Measured:** baseline and post-change token/cache/latency metrics are captured.  
**Verified:** unit and task-quality tests pass; context utilization improves without critical-context loss or quality regression.

## Customization
Tune thresholds from measured runtime telemetry rather than copying defaults blindly. Keep safety margin, correctness retention, bounded retries, and independent verification intact.
