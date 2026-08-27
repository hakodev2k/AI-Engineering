# Post-Compaction Context Refill Guard
**Category:** Token

## Problem
Long-running agent sessions can compact successfully and then immediately refill the context window because large static instructions, agent registries, IDE state, or other repeatable attachments are re-injected on subsequent turns.

## Evidence
See `evidence/research.md`.

## Existing approach
Automatic compaction, manual compaction, larger context windows, prompt caching, and reducing loaded instructions all help, but none guarantees that post-compaction refill stays within a safe budget.

## Existing limitations
Compaction is reactive; repeated static context can be re-added immediately; mixed-model subagents can have different context windows; warnings often identify symptoms rather than the exact refill source.

## Proposed improvement
Measure post-compaction refill by source, enforce a bounded refill budget, and block completion when a source exceeds its configured share until that source is reduced, lazily loaded, deduplicated, or independently retrieved.

## Architecture
- `config/budget.json`
- `scripts/refill_guard.py`
- `tests/test_refill_guard.py`
- `skills/context-refill-analysis.md`
- `rules/token-budget.md`
- `subagents/token-verifier.md`
- `workflows/measure-optimize-verify.md`
- `hooks/post-compaction-check.md`
- `evidence/research.md`

## Installation
Python 3.10+. No third-party packages.

## Usage
`python scripts/refill_guard.py --trace trace.jsonl --budget config/budget.json`

## Metrics
Post-compaction refill tokens/turn, static-context share, turns-to-next-compaction, cache-read ratio, latency, and task-quality regression rate.

## Verification
Run `python -m unittest tests/test_refill_guard.py`.

## Safety
Mandatory system, safety, and task acceptance context MUST NOT be removed merely to reduce tokens.

## Failure handling
Retry optimization at most twice. Fallback to lazy retrieval or a fresh session with preserved task state. Escalate when required context alone exceeds budget.

## Definition of Done
Implemented: instrumentation and guard integrated.  
Measured: baseline and after-change traces captured.  
Verified: lower refill without quality regression and all tests pass.
