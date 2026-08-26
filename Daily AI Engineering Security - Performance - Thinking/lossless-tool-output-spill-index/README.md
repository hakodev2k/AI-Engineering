# Lossless Tool Output Spill Index

**Category:** Token

## Problem
Large tool outputs are routinely truncated, compacted, or persisted in formats that agents cannot page reliably. This wastes context, forces tool re-runs, increases token/latency cost, and can silently remove evidence needed for correct decisions.

## Evidence
See `evidence/research.md` for current public signals from Cloudflare Agents, Hermes Agent, Agenta, and Zed.

## Existing approach
Common approaches cap tool output, compact older messages, persist oversized results, or summarize them before they enter model context.

## Existing limitations
Independent limits can destroy data before persistence, single-line JSON spill files can make line-based paging ineffective, silent truncation can preserve shape while removing contents, and re-running tools can be expensive or non-deterministic.

## Proposed improvement
Use a lossless spill-first contract: preserve the full raw tool result in a content-addressed file before any context reduction, generate a bounded preview plus byte-range index, and require explicit range retrieval for additional evidence.

## Architecture
- `config/policy.json` — size and preview budgets.
- `scripts/tool_output_spill.py` — deterministic spill/index/retrieval implementation.
- `tests/test_tool_output_spill.py` — losslessness and boundary tests.
- `skills/tool-output-budget-analysis.md` — reusable investigation procedure.
- `rules/context-preservation.md` — enforceable token/context rules.
- `subagents/context-reviewer.md` — independent verification role.
- `workflows/measure-and-integrate.md` — baseline, diagnosis, integration, comparison.
- `hooks/post-tool-output.md` — blocking post-tool integration hook.
- `evidence/research.md` — current evidence and root-cause analysis.

## Installation
Python 3.10+; standard library only.

## Configuration
Adjust `config/policy.json`. Keep `spill_threshold_bytes` lower than every upstream destructive truncation threshold.

## Usage
Create a spill envelope:

`python scripts/tool_output_spill.py spill --input result.bin --store .tool-spill --policy config/policy.json`

Retrieve an exact byte range:

`python scripts/tool_output_spill.py read --store .tool-spill --sha256 <digest> --offset 0 --length 4096`

## Workflow
Measure current output sizes and context cost, identify the earliest destructive cap, move spill-before-truncate ahead of that cap, then compare tokens/task, tool re-runs, latency, and evidence recovery.

## Metrics
- input tokens/task
- tool-output bytes/task
- full-output preservation rate
- tool re-run rate
- range-read rate
- p50/p95 tool-to-model latency
- correctness/regression rate on evidence-heavy tasks

## Verification
Run `python -m unittest tests/test_tool_output_spill.py`.

## Safety
Spill storage MUST inherit the sensitivity of the source output. Secrets MUST NOT be logged or embedded in previews beyond the configured policy. Retention SHOULD be bounded by task/session needs.

## Failure handling
Detection: digest mismatch, missing spill, invalid range, or upstream cap preceding spill. Retry policy: one deterministic retry after storage validation. Fallback: block destructive truncation and require the tool to return a smaller scoped result. Stop after the retry; escalate if evidence cannot be preserved.

## Definition of Done
**Implemented:** spill-first hook is integrated before destructive reduction.  
**Measured:** before/after token, latency, re-run, and preservation metrics are captured.  
**Verified:** tests pass; a reviewer proves byte-for-byte recovery for representative large outputs; no critical context is lost.

## Customization
Change budgets and retention, not the invariant that the full output is preserved before preview/truncation.