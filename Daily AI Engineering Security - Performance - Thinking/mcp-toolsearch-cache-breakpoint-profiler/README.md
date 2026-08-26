# MCP ToolSearch Cache Breakpoint Profiler
**Category:** Performance

## Problem
Large or unstable MCP tool-discovery batches can invalidate otherwise healthy prompt-prefix caches, increasing latency and token cost across long-running coding-agent sessions.

## Evidence
See `evidence/research.md` for August 2026 Claude Code and production-trace signals.

## Existing approach
Progressive tool discovery, prompt caching and smaller tool catalogs reduce context size, but teams often optimize schema count without measuring where cache continuity actually breaks.

## Existing limitations
A smaller tool set can still churn cache prefixes; batch size thresholds are provider/runtime-specific; cache hit ratios averaged across a session hide abrupt post-discovery regressions.

## Proposed improvement
Instrument request traces around tool-discovery events, establish a baseline, detect cache breakpoints, recommend bounded batch sizes, then verify before/after latency and token economics.

## Architecture
- `evidence/research.md`
- `skills/cache-breakpoint-analysis.md`
- `rules/performance-rules.md`
- `workflows/measure-optimize-verify.md`
- `hooks/post-tool-discovery.md`
- `scripts/cache_breakpoint_profiler.py`
- `tests/test_cache_breakpoint_profiler.py`

## Installation
Python 3.10+; no third-party dependencies.

## Input format
JSONL, one request per line with `timestamp`, `request_id`, `event`, `tool_schema_count`, `cache_read_tokens`, `cache_creation_tokens`, `input_tokens`, and `latency_ms`.

## Usage
`python scripts/cache_breakpoint_profiler.py trace.jsonl`

## Metrics
Cache-read ratio, cache-creation spike, p50/p95 latency after discovery, input tokens/request, schema batch size, estimated avoidable cache rebuild tokens.

## Verification
Run `python -m unittest tests/test_cache_breakpoint_profiler.py` and compare a baseline trace with a bounded-batch trace.

## Safety
This package is read-only. Trace inputs SHOULD exclude prompt text and secrets; only usage metadata is required.

## Failure handling
Maximum 2 optimization iterations. If telemetry is incomplete, report `insufficient_evidence` rather than claiming improvement.

## Definition of Done
Implemented: profiler/hook integrated. Measured: baseline and candidate metrics captured. Verified: cache continuity or latency/cost improves without reducing required tool correctness.
