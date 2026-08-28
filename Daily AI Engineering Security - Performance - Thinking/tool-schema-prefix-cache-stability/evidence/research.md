# Research — Tool Schema Prefix Cache Stability

**Topic:** Stabilize tool-schema prefixes to reduce coding-agent cache misses  
**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Tool-heavy coding agents repeatedly send large tool declarations near the front of requests. If the same tool set is serialized in a different order, deferred tools are revealed unpredictably, or volatile metadata is inserted before otherwise-stable prompt content, provider prefix/prompt caches can miss. This raises uncached input tokens, cost and time-to-first-token (TTFT) even when task semantics have not changed.

## Why it matters now
Coding agents now generate long multi-turn, tool-heavy workloads. Prompt-cache efficiency materially changes serving cost. Current Qwen Code work explicitly targets stable global tool ordering because progressive MCP discovery, ToolSearch and reconnects can serialize identical tool sets differently and invalidate the following cache prefix.

## Affected users
Coding-agent developers, MCP/tooling platform teams, self-hosted inference operators, and engineering teams paying for token-heavy agent sessions.

## Current public evidence
### Observed evidence
1. Qwen Code's current design document `global-tool-schema-stable-sort.md` states that tool schemas are often large and near the front of the provider cache prefix; different registration order for the same tool set creates unnecessary prompt-cache misses. It proposes deterministic sorting at the declaration-generation layer. Source: https://github.com/QwenLM/qwen-code/blob/main/docs/design/prompt-cache/global-tool-schema-stable-sort.md
2. Qwen Code issue #8277 (August 2026) groups active cache-stability problems including tool-search KV-cache invalidation, stable schema ordering, deferred-tool visibility and prompt-cache behavior. Source: https://github.com/QwenLM/qwen-code/issues/8277
3. TraceLab (University of Washington SyFI Lab, June 25 2026) characterizes real coding-agent workloads as long-context, repeated tool-using workloads and releases traces specifically to study serving efficiency. Source: https://syfi.cs.washington.edu/blog/2026-06-25-tracelab/
4. Requesty's April 2026 coding-agent dataset reports large differences in prompt-cache hit rate across coding agents and notes the resulting effective-input-cost gap. Source: https://www.requesty.ai/data/coding-agent-cache-hit-rate-apr-2026

### Interpretation
Provider caching is not sufficient when the application itself mutates an otherwise-equivalent prefix. Tool ordering, schema formatting and late discovery are application-level cache-key instability sources. A client needs observable cache invariants and regression tests, not just a cache-enabled API.

## Existing approaches
- Provider prompt/prefix caching.
- Deferred tool loading and ToolSearch.
- Prompt compaction and context summarization.
- Tool-schema preloading when context permits.
- Stable sorting in individual agent implementations.

## Remaining limitations
- Same semantic tool set can serialize differently.
- Dynamic discovery can invalidate an expensive prefix repeatedly.
- Teams often monitor total tokens but not cached-vs-uncached tokens.
- Prompt changes may reduce cost by accidentally removing correctness-critical context.
- Provider-specific cache telemetry is not normalized into a reusable regression gate.

## Root-cause analysis
1. Tool registration order leaks into serialization.
2. Stable and volatile prompt blocks are interleaved.
3. Deferred tool discovery changes the prefix without a budget policy.
4. Cache-hit metrics are not part of Definition of Done.
5. Token optimization lacks a quality-regression gate.

## Improvement opportunity
Create a deterministic analyzer and workflow that fingerprints tool schemas, measures order/schema drift, normalizes cache metrics, enforces a stable-prefix budget, and verifies cost/latency improvement against a quality baseline.

## Goal
Reduce uncached prompt tokens and TTFT while preserving task quality and required tool availability.

## Metrics
- cache hit ratio
- uncached input tokens/task
- tool-schema bytes/request
- distinct tool-set fingerprints
- distinct tool-order fingerprints for the same set
- TTFT p50/p95
- total latency p50/p95
- quality/regression pass rate

## Trigger
Any change to tool registration, MCP discovery, prompt assembly, provider adapter, cache policy or context compaction.

## Inputs
JSONL request traces and optional token/cache budget configuration.

## Outputs
Machine-readable cache-stability report, blocking budget result, and before/after comparison evidence.

## Proposed solution
The package implements deterministic canonicalization and trace analysis, mandatory stable-prefix rules, a cache investigator, an independent verifier, a bounded Measure→Diagnose→Optimize→Measure workflow, and a preflight hook.

## Relevant sources
- Qwen Code stable sort design: https://github.com/QwenLM/qwen-code/blob/main/docs/design/prompt-cache/global-tool-schema-stable-sort.md
- Qwen Code issue #8277: https://github.com/QwenLM/qwen-code/issues/8277
- TraceLab: https://syfi.cs.washington.edu/blog/2026-06-25-tracelab/
- Requesty cache-hit dataset: https://www.requesty.ai/data/coding-agent-cache-hit-rate-apr-2026
