# Prompt Cache Churn Profiler

**Category:** Performance  
**Run date:** 2026-09-06 (UTC+7)

## Problem
Long agent sessions can repeatedly lose or fail to reuse large prompt-prefix caches, forcing hundreds of thousands of stable input tokens to be rewritten and reprocessed. Recent Claude Code and VS Code reports describe repeated mid-session cache drops, 5-minute TTL gaps, and massive redundant cache writes.

## Evidence
See `evidence/research.md`.

## Existing approach
Provider prompt caching, automatic cache breakpoints, explicit cache-control markers, 5-minute or 1-hour TTLs, stable prompt prefixes, and usage counters already exist. Anthropic documents `cache_read_input_tokens`, `cache_creation_input_tokens`, and TTL behavior.

## Existing limitations
Cache health is often invisible at the agent-orchestration layer. A request can remain functionally correct while cost and latency regress sharply. TTL choice, prompt mutation, tool/thinking configuration changes, and orchestration gaps can invalidate or expire caches. A raw cache-hit percentage can hide large absolute rewrites.

## Proposed improvement
Instrument every model call as a cache event; attribute cache writes to expiry, prefix mutation, configuration mutation, or unknown cause; compute redundant-write ratio and avoidable rewrite tokens; block performance claims without a before/after trace. Recommend changes only after measurement.

## Architecture
- `evidence/research.md`
- `skills/cache-churn-investigation.md`
- `rules/cache-performance-rules.md`
- `subagents/cache-benchmark-reviewer.md`
- `workflows/measure-diagnose-optimize.md`
- `hooks/post-model-call.md`
- `scripts/cache_churn_profiler.py`
- `config/thresholds.example.json`
- `examples/trace.example.jsonl`
- `tests/test_cache_churn_profiler.py`

## Installation
Python 3.10+, standard library only.

## Configuration
Set thresholds for minimum stable prefix, redundant-write ratio, and tolerated cache-reset count. Provider adapters should normalize usage into the trace schema documented in the example.

## Usage
`python scripts/cache_churn_profiler.py config/thresholds.example.json examples/trace.example.jsonl`

Exit 0 means the trace is within configured cache-churn budget. Exit 3 means a measurable performance regression/churn condition. Exit 1 means malformed inputs.

## Workflow
Measure trace -> establish baseline -> classify resets -> form hypothesis -> change TTL/prefix/orchestration only if evidence supports it -> replay the same workload -> compare tokens, cost proxy, cache hit ratio, and latency proxy -> independent review.

## Metrics
Input tokens/task; cache-read tokens/task; cache-write tokens/task; redundant cache-write tokens; cache-reset count; weighted cache-read ratio; write amplification; inter-call gap; TTFT when available; cost/task; latency/task; task success/regression rate.

## Verification
**Implemented:** profiler, rules, hook, workflow, fixtures, tests.  
**Measured:** same workload produces baseline and candidate traces.  
**Verified:** candidate reduces redundant cache writes and/or latency/cost proxy without reducing task success or required context; independent reviewer confirms comparison.

## Safety
Do not remove security instructions, user requirements, tool schemas, or correctness-critical context merely to preserve cache locality. Cache optimization must not alter authorization boundaries.

## Failure handling
Malformed/incomplete telemetry blocks optimization conclusions. Retry trace capture once. Optimization experiments are bounded to two candidate changes; if neither improves metrics, restore baseline and escalate with evidence.

## Definition of Done
Evidence documented; baseline trace captured; churn cause classified; candidate measured on same workload; regression thresholds pass; no critical context removed; task quality preserved; reviewer verifies results.

## Customization
Extend trace adapters for OpenAI, Anthropic, Bedrock, Vertex, or local gateways while preserving normalized metrics and evidence-based attribution.