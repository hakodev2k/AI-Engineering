# Aggregate Tool Output Context Budget Guard

**Category:** Token

## Problem
Many medium-sized tool results can collectively overflow an agent's next model request even when each result is below individual truncation thresholds. Reactive compaction then thrashes or fails, retries multiply cost, and task-critical conversation state may be lost.

## Evidence
See `evidence/research.md`. Current evidence includes OpenClaw #113701 with July/August 2026 production reports, Anthropic Agent SDK Python #958, OpenClaw #9140, and Hermes Agent #13164.

## Existing approach
Per-result truncation, reactive compaction, manual context reset, smaller reads, and compression-tail budgets.

## Existing limitations
Per-result limits miss cumulative growth; reactive compaction is too late; blind truncation can remove critical evidence; identical retries can multiply tokens without changing the request.

## Proposed improvement
Apply a deterministic cumulative preflight before tool outputs enter the next model request. Reserve output headroom and a safety margin, enforce per-result and per-turn budgets, and externalize/chunk/summarize overflow while retaining bounded evidence excerpts and stable references.

## Architecture / Actual package tree
```text
README.md
evidence/research.md
config/budget.json
scripts/context_budget_guard.py
tests/test_context_budget_guard.py
skills/context-budget-analysis.md
rules/context-budget.md
subagents/token-verifier.md
workflows/measure-optimize.md
workflows/regression-verification.md
hooks/pre-model-request.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Set the real model context limit, reserved output budget, safety margin, per-result budget, aggregate per-turn budget, and conservative character/token estimate in `config/budget.json`.

## Usage
`python scripts/context_budget_guard.py --event event.json --config config/budget.json`

The event contains `existing_context_tokens`, `identical_overflow_retries`, and a `tool_results` array. Tool results may supply exact `tokens`; otherwise the script uses the configured conservative estimate.

## Workflow
Measure baseline → diagnose individual/aggregate contributors → form a bounded optimization hypothesis → externalize/chunk/filter/summarize safely → measure again → independently verify result quality.

## Metrics
Tokens/task, tool-output tokens/turn, context utilization, compaction count, overflow retries, latency, evidence-retention coverage, result-quality regression rate.

## Verification
Run `python -m unittest tests/test_context_budget_guard.py`, then replay representative healthy and overflow traces under the same task acceptance criteria.

## Safety
Never remove instructions, authorization boundaries, or correctness-critical evidence simply to save tokens. Preserve stable references to externalized raw output. No unbounded retries.

## Failure handling
**Detection:** guard exit 3 or context-limit error. **Evidence:** context/token counts and result metadata. **Retry:** max two optimization revisions; one identical overflow retry. **Fallback:** narrower tool query, chunking, externalization with evidence excerpts, or controlled fresh-context handoff. **Escalation:** platform owner when required evidence cannot fit. **Stop:** safety/quality regression, persistent overflow, or exhausted retries.

## Definition of Done
**Implemented:** pre-request guard and integration hook active.  
**Measured:** baseline and optimized token/latency/overflow metrics collected.  
**Verified:** aggregate-overflow fixtures block before model request, healthy traces pass, required evidence remains available, quality does not critically regress, retries remain bounded.

## Customization
Prefer provider-reported token counts or model-specific tokenizers when available. Tune budgets from measured traces, not arbitrary cost targets, and never trade away correctness-critical context.
