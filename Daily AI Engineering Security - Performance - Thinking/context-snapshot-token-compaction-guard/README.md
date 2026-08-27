# Context Snapshot Token Compaction Guard

**Category:** Token

## Problem
Agent runtimes can confuse cumulative token usage with the actual current-context size, triggering premature compaction. Compaction itself can then discard recent intent, constraints, or verification state.

## Evidence
See `evidence/research.md` for current August 2026 signals.

## Existing approach
Runtimes often use provider usage counters or session-level token totals to decide when to compact, summarize or evict context.

## Existing limitations
Cumulative usage is not a context snapshot; provider counters vary; compaction may fire at a small fraction of the real window; summaries can lose recent task state.

## Proposed improvement
Separate `context_snapshot_tokens` from cumulative usage, require provenance for any value used as a compaction trigger, impose sanity bounds, and preserve a compact critical-state ledger across compaction.

## Architecture
- `evidence/research.md`
- `skills/context-budget-analysis.md`
- `rules/token-accounting.md`
- `subagents/context-verifier.md`
- `workflows/measure-compact-verify.md`
- `hooks/pre-compaction.md`
- `scripts/compaction_guard.py`
- `tests/test_compaction_guard.py`

## Installation
Python 3.10+; standard library only.

## Usage
Run the guard on a JSON metrics event before compaction. Exit code 0 permits compaction; exit code 3 blocks it as unsafe or unjustified.

## Metrics
Compactions/task, compaction trigger utilization ratio, tokens before/after, retained critical-state coverage, post-compaction regression rate, latency and cost/task.

## Verification
Run `python -m unittest tests/test_compaction_guard.py`.

## Safety
The guard prefers preserving required context over token savings. It never removes security constraints or approval state merely to save tokens.

## Failure handling
Maximum 2 measurement retries. If snapshot provenance remains unknown, skip automatic compaction and escalate to the runtime owner.

## Definition of Done
Implemented: snapshot/cumulative counters separated and hook integrated. Measured: before/after token and quality metrics captured. Verified: tests pass and critical-state retention remains complete after compaction.
