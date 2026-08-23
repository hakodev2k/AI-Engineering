# Agent Process-Tree Memory Attribution Profiler

Category: **Performance**

## Problem
AI coding hosts are multi-process systems. Root process RSS alone can misdiagnose memory growth when the actual consumer is a renderer, app-server child, MCP server, command shim, parser, or other descendant. In one current Claude Code report the leaking embedded `ugrep` even presents as `claude`, making process-name attribution actively misleading.

## Evidence
See `evidence/research.md` for current August 2026 signals from Claude Code and Codex.

## Proposed improvement
Profile the full descendant process tree at repeated timestamps, separate root from child RSS, rank contributors, measure growth slope/peak, and compare candidate traces to a baseline. Regression decisions are based on tree-level evidence, not executable name alone.

## Package tree
- `evidence/research.md`
- `skills/process-tree-memory-analysis.md`
- `rules/memory-attribution-rules.md`
- `subagents/memory-regression-reviewer.md`
- `workflows/baseline-attribution-regression.md`
- `hooks/post-soak-memory-gate.md`
- `config/policy.example.json`
- `scripts/process_tree_memory_profiler.py`
- `tests/test_process_tree_memory_profiler.py`

## Installation
Python 3.10+, standard library only.

## Input
JSONL samples, one process per line: `{"ts":0,"pid":100,"ppid":1,"rss_bytes":104857600,"label":"agent"}`. Capture all relevant processes at each timestamp with stable PIDs for that sample.

## Usage
`python scripts/process_tree_memory_profiler.py --input candidate.jsonl --root-pid 100 --policy config/policy.example.json --baseline baseline.jsonl`

Exit codes: 0 pass, 2 regression, 3 invalid trace/config.

## Metrics
Root/tree/child start and end RSS, peak tree RSS, tree growth MiB, tree slope MiB/min, descendant count, top descendant contribution, baseline deltas.

## Verification
Run `python -m unittest tests/test_process_tree_memory_profiler.py`. Tests prove unrelated processes are excluded, child-only leaks are visible at tree level, and configured growth limits block regressions.

## Safety
Profiler consumes offline telemetry only. It never kills processes or executes agent/tool commands.

## Failure handling
Missing root samples, malformed parent relationships, or invalid thresholds fail closed. Repeat a noisy soak at most twice; do not raise thresholds merely to obtain a pass.

## Definition of Done
Baseline captured; candidate measured under comparable workload; root and descendants attributed; regression thresholds evaluated; top contributor identified; tests pass; independent reviewer confirms evidence.
