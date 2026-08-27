# Research — Agent Prompt Cache Prefix Profiler

**Topic:** Prompt-cache invalidation and repeated tool-schema token waste in agentic systems  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Long-running and tool-heavy agents repeatedly resend large static prefixes—tool schemas, system instructions and history—when cache placement or prompt mutation invalidates prefix reuse. Cost and latency can rise sharply even when task content changes only slightly.

## Why it matters now
Multiple 2026 reports provide measured evidence of cache failures in tool-heavy and multi-agent workloads, while current Anthropic guidance documents exact prefix-matching rules and cache-invalidating changes.

## Affected users
Agent-platform builders, AI coding users, MCP-heavy workflows, multi-agent orchestrators, and teams paying token-based inference costs.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #20880 (2026-05-06) reports ~70% input-token overhead from uncached tool schemas: 28 tools produced ~11,834 schema tokens repeatedly sent across internal calls. Source: https://github.com/NousResearch/hermes-agent/issues/20880
2. Claude Code issue #75142 (2026-07-07) reports first-time mid-session tool loading via skill/MCP/tool-search invalidating prompt cache. Source: https://github.com/anthropics/claude-code/issues/75142
3. Claude Code issue #81967 (2026-07-28) reports measured prompt-cache invalidation from tools-array mutation and TTL behavior across 1,821 requests. Source: https://github.com/anthropics/claude-code/issues/81967
4. Claude Code issue #82739 (2026-07-30) reports subagent dispatch where a 33-token prompt difference rewrote ~5,308 cached tokens because the final cache breakpoint sat too far upstream. Source: https://github.com/anthropics/claude-code/issues/82739
5. Anthropic prompt-caching guidance states caching is exact prefix matching; tools render before system/messages; adding/removing/reordering tools invalidates downstream cache; cache breakpoints have a 20-block lookback window. Source: https://github.com/anthropics/skills/blob/main/skills/claude-api/shared/prompt-caching.md

### Interpretation
Cache inefficiency is often a prompt-construction problem rather than a model problem: mutable tool ordering, dynamic data placed before stable prefixes, insufficient breakpoint proximity, and unmeasured tool-schema size cause repeated cache creation or uncached input.

## Existing approaches
- Provider prompt caching and cache-control breakpoints.
- Session compaction/summarization.
- Tool search/deferred loading.
- Manual prompt minimization.
- Reusing one model/session for longer periods.

## Remaining limitations
- Cache hit rate alone can hide expensive cache writes and large uncached static prefixes.
- Tool schemas may dominate input while remaining outside cached regions.
- Dynamic tool discovery can mutate the earliest prefix segment and invalidate everything downstream.
- Breakpoints can silently miss when too many content blocks intervene.
- Teams often lack task-level before/after measurements linking a specific prefix mutation to token/cost/latency changes.

## Root-cause analysis
1. Prompt components are not fingerprinted by semantic role and stability.
2. Tool arrays are not serialized deterministically or are mutated mid-session.
3. Static/dynamic context boundaries are not measured before cache placement.
4. Cache creation/read tokens are observed globally rather than correlated with prefix mutations.
5. Optimization changes are accepted without quality/regression gates.

## Improvement opportunity
Build a deterministic trace profiler that fingerprints tool/system prefixes, measures cache read/create ratios and repeated static-token waste, identifies mutation events, and compares before/after traces. Pair it with enforceable rules for deterministic tool ordering, stable-prefix placement, token budgets, and quality-preserving regression verification.

## Goal
Reduce tokens/task, cache-rewrite overhead and latency without removing correctness-critical context.

## Metrics
Input tokens/task, cache-read ratio, cache-creation ratio, static-prefix tokens, tool-schema tokens, estimated uncached replay tokens, latency/task, result-quality pass rate, regression rate.

## Trigger
New tool/MCP integration, prompt-template change, model-routing change, cache anomaly, or token/cost regression.

## Inputs
JSONL request traces with timestamp/task, tool fingerprint or tool definitions, system fingerprint, input/cache token usage, latency and quality status.

## Outputs
Measured baseline, mutation events, waste estimate, optimization candidates, before/after comparison and verification decision.
