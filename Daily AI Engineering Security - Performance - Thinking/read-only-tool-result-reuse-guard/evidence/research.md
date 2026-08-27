# Research — Read-Only Tool Result Reuse Guard

**Topic:** Redundant read-only tool executions in long-running AI-agent loops  
**Category:** Performance  
**Research date:** 2026-08-28 (UTC+7)

## Problem
AI agents repeatedly execute identical or near-identical read-only tools, paying external latency/API cost and re-injecting repeated outputs into context even when the underlying state has not changed.

## Why it matters now
Recent workload studies and framework issue reports converge on the same failure mode: agentic systems spend meaningful time and tokens on redundant tool activity, but most runtimes do not provide a safe, measurable, default result-reuse layer.

## Affected users
Agent framework maintainers, AI coding-agent users, research agents, platform teams, and developers using costly search, retrieval, web-fetch, diagnostics, or repository-read tools.

## Current public evidence

### Observed evidence
1. **AgentSysBench / arXiv 2608.15127**, submitted August 15, 2026, characterizes ten agentic applications and production traces. It reports heavy cross-request redundancy in search queries and web fetches. A tool-result caching exploration removes 35.2% of redundant search calls and saves 19.3% of aggregate search latency.  
   https://arxiv.org/abs/2608.15127
2. **Haystack issue #11588**, opened June 11, 2026, reports multi-step agents re-calling the same tools with identical arguments and proposes opt-in caching keyed by tool name plus canonicalized arguments, with short TTL and per-run scope.  
   https://github.com/deepset-ai/haystack/issues/11588
3. **Docker Agent issue #3939**, opened August 7, 2026, reports repeated read-only tool results being resent in full, causing repeated token cost and earlier compaction; existing large-result truncation does not solve repeated execution.  
   https://github.com/docker/docker-agent/issues/3939
4. **Hermes Agent issue #18076**, opened April 30, 2026, reports repeated successful tool calls with identical or equivalent information and argues that warning-only loop guards and result caches address different layers of the problem.  
   https://github.com/NousResearch/hermes-agent/issues/18076
5. **Hermes Agent issue #2918**, opened March 25, 2026, specifically requests caching for repeated `web_search` and `web_extract` calls because identical external requests consume credits and add latency.  
   https://github.com/NousResearch/hermes-agent/issues/2918

### Interpretation
The performance problem is not simply "agents sometimes loop." Duplicate tool execution is a distinct systems-layer inefficiency. Preventing it requires: canonical request identity, proof that the tool is read-only/idempotent, a freshness TTL, a cache scope, and measurable before/after results. Caching without these controls can create stale-state or cross-tenant correctness/security failures.

## Existing approaches
- Loop warnings or progress detectors.
- In-memory memoization for exact calls.
- Tool-output truncation.
- Framework-specific caches.
- Manual agent instructions such as "do not repeat calls."

## Remaining limitations
- Warning mechanisms often fire after the external call is already paid for.
- Exact-call caches need canonical argument handling.
- Read-only status is rarely machine-enforced.
- TTL and scope are often implicit.
- Repeated outputs can still be reinserted into model context even if execution is cached.
- Teams may enable caching without a baseline duplicate-rate or stale-result test.

## Root-cause analysis
1. Tool invocation layers execute model requests literally without a reuse registry.
2. Tool definitions often lack idempotence/freshness metadata.
3. Argument ordering or harmless formatting prevents exact-key matching.
4. Agent memory loses prior result salience, causing re-requests.
5. Tool-result lifetime is not coupled to task/session scope.
6. Optimization is attempted without measuring duplicate execution and avoidable latency first.

## Improvement opportunity
Create a deterministic profiler and pre-tool gate that canonicalizes arguments, identifies duplicate calls within the declared scope/TTL, reports avoidable latency, and permits reuse only for explicitly read-only tools. Pair it with output-digest comparison and stale-result regression tests.

## Relevant sources
- https://arxiv.org/abs/2608.15127
- https://github.com/deepset-ai/haystack/issues/11588
- https://github.com/docker/docker-agent/issues/3939
- https://github.com/NousResearch/hermes-agent/issues/18076
- https://github.com/NousResearch/hermes-agent/issues/2918
