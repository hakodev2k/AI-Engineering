# MCP Result Metadata Token Budget Guard

Category: **Token**

## Problem
Modern MCP responses can carry repeated result metadata on every call. In tool-heavy agent sessions, fixed metadata that is useful to UI/logging but irrelevant to model reasoning can consume context repeatedly. A 2026 GitHub structural audit measured a fixed ~590-token icon block on every GitHub MCP tool call it sampled.

## Evidence
See `evidence/research.md`.

## Proposed improvement
Measure repeated `_meta` separately from semantic tool payload, strip or externalize model-irrelevant metadata before model-context admission when protocol/client policy allows, and enforce a per-call metadata token budget without changing the transport response itself.

## Architecture
- `scripts/profile_result_meta.py` — deterministic JSONL profiler.
- `skills/result-meta-budget-analysis.md` — measurement procedure.
- `rules/context-admission-rules.md` — token/context rules.
- `subagents/token-reviewer.md` — independent verification role.
- `workflows/measure-filter-verify.md` — before/after workflow.
- `hooks/post-tool-context-filter.md` — context admission hook contract.
- `tests/test_profile_result_meta.py` — regression tests.

## Usage
Capture MCP tool results as one JSON object per line and run `python scripts/profile_result_meta.py results.jsonl`. The script reports total bytes, `_meta` bytes, repeated server-info bytes, estimated tokens, and ratios. It never modifies the capture.

## Metrics
Metadata bytes/tokens per tool call, repeated metadata ratio, context tokens/task, cost/task, latency/task, quality regression rate.

## Safety
Filtering is only for the model-context copy. The original protocol response MUST remain available for UI, debugging, auditing and protocol behavior. Never remove metadata used for security, authorization, correlation, cache partitioning or correctness.

## Definition of Done
Baseline captured; repeated metadata measured; context filter scoped to proven model-irrelevant fields; before/after token comparison produced; quality/correctness checks pass; original responses retained.