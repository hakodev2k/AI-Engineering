# Prompt Cache Collapse Session Profiler

**Category:** Token

## Problem
Large AI coding sessions can unexpectedly lose prompt-cache reuse, forcing hundreds of thousands of tokens to be rewritten and increasing cost and latency even when most context is unchanged.

## Evidence
See `evidence/research.md` for multiple August 2026 Claude Code reports and a fresh Codex context-management report.

## Existing approach
Prompt caching, cache TTLs, context compaction, manual session restart, and vendor telemetry.

## Existing limitations
Cache invalidation can be opaque; users often discover collapse only after cost spikes; one-off cache misses are hard to distinguish from persistent regressions; context changes and client/version changes are not correlated automatically.

## Proposed improvement
Profile request-level cache read/write ratios, detect sustained cache-collapse episodes, correlate them with context size and event markers, and gate optimization claims on before/after measurements.

## Package tree
- `evidence/research.md`
- `config/thresholds.json`
- `scripts/cache_collapse_profiler.py`
- `tests/test_cache_collapse_profiler.py`
- `skills/cache-regression-analysis.md`
- `rules/token-cache-budget.md`
- `workflows/measure-diagnose-verify.md`
- `hooks/post-session.md`

## Installation
Python 3.10+. No third-party dependencies.

## Usage
`python scripts/cache_collapse_profiler.py --trace trace.jsonl --config config/thresholds.json`

## Metrics
Cache-read ratio, cache-write ratio, rewritten tokens, collapse streak, latency p50/p95, tokens/task, estimated redundant-write tokens.

## Verification
Run `python -m unittest tests/test_cache_collapse_profiler.py`.

## Safety
The profiler reads telemetry only and never removes context required for correctness.

## Failure handling
Malformed or incomplete traces fail explicitly. Maximum optimization iterations: 2. If cache behavior cannot be isolated, preserve context and escalate rather than deleting information blindly.

## Definition of Done
**Implemented:** profiler and hook installed. **Measured:** baseline and candidate sessions recorded. **Verified:** tests pass and any claimed improvement shows lower redundant writes/cost or latency without quality regression.
