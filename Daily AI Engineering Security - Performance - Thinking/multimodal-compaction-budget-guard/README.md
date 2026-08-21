# Multimodal Compaction Budget Guard

**Category:** Token

## Problem
Image-heavy agent histories can pass text-oriented compaction logic while retaining large inline image payloads. The compacted prompt then stays near the next compaction threshold, identical image bytes are copied into later snapshots, persistent history grows, and fork/resume requests can become too large to complete.

## Evidence
See `evidence/research.md`. Current public reports include repeated auto-compaction with only ~8k tokens of headroom after compaction and a newer full-history fork failure involving repeated multi-megabyte image-bearing compaction records.

## Existing approach and limitation
Token-based truncation and replacement history work well for text-dominated sessions, but image count, encoded bytes, visual token estimates, duplicate payloads, and compaction hysteresis must be budgeted explicitly. Blindly dropping all old images is also unsafe because some visual evidence remains necessary for correctness.

## Proposed improvement
Apply a multi-dimensional budget before and after compaction: estimated text tokens, estimated image tokens, image count, inline bytes, duplicate bytes, and required headroom. Deduplicate first, preserve protected/recent evidence, then evict stale unprotected payloads with provenance/reference when supported. Re-run task acceptance checks before declaring success.

## Architecture
- `skills/multimodal-context-budgeting.md` — reusable measurement/optimization procedure.
- `rules/multimodal-context-policy.md` — enforceable token/context rules.
- `subagents/context-budget-reviewer.md` — independent quality/budget reviewer.
- `workflows/measure-optimize-verify.md` — bounded two-attempt optimization workflow.
- `hooks/pre-compaction-budget-gate.md` — deterministic pre/post compaction and fork/resume gate.
- `scripts/multimodal_budget.py` — dependency-free recursive history analyzer.
- `tests/test_multimodal_budget.py` — duplicate, count, and hysteresis regression tests.
- `evidence/research.md` — public evidence, current approaches, gaps, and root causes.

## Package tree
```text
multimodal-compaction-budget-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-compaction-budget-gate.md
├── rules/multimodal-context-policy.md
├── scripts/multimodal_budget.py
├── skills/multimodal-context-budgeting.md
├── subagents/context-budget-reviewer.md
├── tests/test_multimodal_budget.py
└── workflows/measure-optimize-verify.md
```

## Installation
Python 3.9+; standard library only. The script expects normalized JSON history and scans nested strings for `data:image/...` URLs.

## Usage
```bash
python scripts/multimodal_budget.py \
  --input history.json \
  --context-window 258400 \
  --trigger 244800 \
  --required-headroom 20000 \
  --max-images 24 \
  --max-inline-bytes 16777216 \
  --image-token-estimate 1024
```

The image-token value is deliberately labeled an estimate. The report separately exposes measured image count, unique/duplicate bytes, and text characters.

## Workflow
Observe baseline → diagnose duplicate/stale image pressure → form one bounded optimization hypothesis → deduplicate/evict only unprotected evidence → measure again → verify headroom and task quality → retry with a different hypothesis at most once → independent review.

## Metrics
Input tokens/task, estimated image tokens, image count, unique/duplicate inline bytes, context utilization, projected post-compaction headroom, compactions per 10 turns, rollout growth per turn, request failure rate, and task-quality regression rate.

## Verification
Run:

```bash
python -m unittest tests/test_multimodal_budget.py
```

A production integration is complete only when the deterministic budget passes *and* the same task acceptance/eval suite passes with no critical context loss.

## Safety
The analyzer is read-only. It does not rewrite history or decode data to files. Optimization policy prioritizes duplicate elimination and stale/unprotected evidence; protected context must not be silently removed.

## Failure handling
**Detection:** script BLOCK, insufficient headroom, excessive image/byte budget, request replay failure, or acceptance regression. **Evidence:** retain before/after reports and protected-evidence inventory. **Retry:** maximum two optimization attempts. **Fallback:** keep required evidence and stop automatic compaction/fork materialization. **Escalation:** larger-context/model or storage/reference architecture review. **Stop:** never weaken correctness requirements merely to pass the token budget.

## Implemented / Measured / Verified
- **Implemented:** rules, skill, workflow, hook, analyzer, tests, independent reviewer contract.
- **Measured:** the analyzer produces explicit measured and estimated budget dimensions for a supplied history.
- **Verified:** a concrete optimized history is Verified only when budget/headroom pass and the task acceptance criteria do not regress under independent review.

## Definition of Done
Evidence documented; baseline captured; duplicate/stale causes identified; protected evidence preserved; post-compaction budget and hysteresis pass; before/after metrics recorded; task acceptance passes; at most two attempts used; independent reviewer returns VERIFIED; no blocking issue remains.

## Customization
Adapt image-token estimation to the target model, add content-addressed blob references, distinguish screenshots from generated images, protect evidence by age/relevance, or add per-tool-output budgets while retaining the same fail-closed quality rule.