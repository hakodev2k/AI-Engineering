# Effective Context Compaction Calibrator

## Topic
Model/provider-aware calibration of agent context-compaction thresholds.

## Category
Token

## Problem
Agent runtimes can calculate compaction thresholds from advertised raw context windows even when the effective usable prompt budget is smaller. An apparent 90% threshold can behave like ~95% of usable capacity, eroding output runway and amplifying token cost in repeated tool/model loops. Other accounting errors can compact too early.

## Evidence
See `evidence/research.md`. Current signals include Codex #40095 and #39767, Claude Code #85499, and August 2026 research/engineering data on effective context and compaction economics.

## Existing approach
Static context percentages, fixed response reserves, manual compaction, provider metadata, prompt caching, and summarization.

## Existing limitations
Raw capacity, usable capacity, provider hard limits, completion runway, hidden overhead, and runtime token accounting may disagree. Model/provider switches can invalidate prior assumptions.

## Proposed improvement
Calculate a bounded trigger from minimum effective capacity, required response runway, target utilization, and minimum headroom. Recompute whenever model/provider metadata changes, then validate with before/after token, latency, cost, failure, and quality metrics.

## Architecture
- `evidence/research.md` — public evidence and root-cause analysis.
- `config/default-policy.json` — conservative reference policy.
- `skills/compaction-threshold-calibration.md` — reusable calibration procedure.
- `rules/effective-context-budget.md` — enforceable budget invariants.
- `subagents/context-budget-analyst.md` — independent reviewer.
- `workflows/calibrate-and-verify.md` — bounded optimization workflow.
- `hooks/preflight-context-budget.md` — preflight contract.
- `scripts/context_calibrator.py` — deterministic calculator.
- `tests/test_context_calibrator.py` — regression tests.

## Actual package tree
```text
effective-context-compaction-calibrator/
├── README.md
├── config/default-policy.json
├── evidence/research.md
├── hooks/preflight-context-budget.md
├── rules/effective-context-budget.md
├── scripts/context_calibrator.py
├── skills/compaction-threshold-calibration.md
├── subagents/context-budget-analyst.md
├── tests/test_context_calibrator.py
└── workflows/calibrate-and-verify.md
```

## Installation
Python 3.9+; standard library only.

## Configuration
`config/default-policy.json` defines target utilization 0.88, minimum response runway 12,000 tokens, and minimum compaction headroom 16,000 tokens. Tune only with representative quality/cost measurements.

## Usage
Prepare JSON containing `raw_window_tokens`, `effective_context_percentage`, `response_reserve_tokens`, optional `provider_hard_limit_tokens`, optional configured trigger, and current prompt occupancy. Run `python scripts/context_calibrator.py --input context.json --policy config/default-policy.json`.

## Workflow
Measure baseline → diagnose window/accounting source → calibrate → apply candidate in host runtime → measure again → bounded retry if needed → independent verification.

## Metrics
Tokens/task, input tokens per sampling call, cost/task, latency/task, compactions/task, compaction failure rate, utilization at compaction, response runway, and result-quality regression rate.

## Verification
`python -m unittest tests/test_context_calibrator.py`

## Safety
Never discard security constraints, approval state, required task evidence, or correctness-critical context merely to hit a lower token target.

## Failure handling
Invalid metadata blocks automatic policy changes. Candidate tuning is limited to three thresholds. On persistent failure, restore the last verified threshold and escalate instead of guessing a larger window.

## Definition of Done
**Implemented:** host threshold is derived from effective capacity/runway. **Measured:** before/after token, cost, latency, compaction, and quality metrics exist. **Verified:** deterministic tests pass and independent review confirms no critical quality/security regression.

## Customization
Add provider-specific hard limits or more conservative reserves. Recalibrate on every route/model change instead of carrying thresholds across incompatible models.
