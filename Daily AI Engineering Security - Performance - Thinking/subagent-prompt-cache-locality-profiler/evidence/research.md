# Research — Subagent Prompt Cache Locality Profiler

## Topic
Subagent Prompt Cache Locality Profiler

## Category
Token / Performance

## Problem
Parallel or repeatedly spawned subagents can share large static instructions, tool schemas, and parent context while still re-creating substantial prompt-cache prefixes independently. Small per-agent prompt differences or cache-boundary placement can invalidate or fragment otherwise identical prefixes, multiplying cache-write tokens and cost as fan-out grows.

## Why it matters now
Multiple 2026 Claude Code reports include measured transcript-level evidence of repeated cache creation in parallel/team/subagent workloads. Current agentic coding workflows increasingly use fan-out, so cache locality becomes an orchestration property rather than only a provider feature.

## Affected users
Developers using parallel coding/review agents, AI-agent platform builders, teams with high tool-schema/context volume, and operators managing token/cost/latency budgets.

## Current public evidence
### Observed evidence
1. **Claude Code issue #82739 (2026-07-30):** measured that a 33-token subagent prompt difference caused roughly 5.3k tokens of otherwise identical cached content to be rewritten because the final cache breakpoint sat far upstream of the user message. Source: https://github.com/anthropics/claude-code/issues/82739
2. **Claude Code issue #81967 (2026-07-28):** measured 1,821 API request bodies and reported prompt-cache invalidation from tools-array mutation and TTL changes during a session. Source: https://github.com/anthropics/claude-code/issues/81967
3. **Claude Code issue #63981 (2026-05-30):** reported parallel Workflow sibling lanes re-creating shared prompt cache per lane rather than sharing a larger common prefix, with multi-file audit examples re-creating large amounts of identical shared context. Source: https://github.com/anthropics/claude-code/issues/63981
4. **Claude Code issue #74318 (2026-07-05):** profiled about 95 sessions and 1,800 subagents and proposed structural cache improvements after measuring avoidable subagent prompt spend. Source: https://github.com/anthropics/claude-code/issues/74318
5. **GitHub Copilot optimization guidance:** recommends preserving prompt cache in agentic coding because system prompts, file contents, and tool definitions are repeatedly sent across turns; model switches and stale sessions invalidate cache. Source: https://docs.github.com/en/copilot/tutorials/optimize-ai-usage
6. **OpenAI API prompt-cache controls:** current Responses API exposes `prompt_cache_key` and `prompt_cache_retention`, demonstrating that cache identity/retention are explicit request-level concerns. Source: https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta

## Interpretation
A high overall cache-hit rate can hide fan-out amplification. The useful unit is not merely per-request hit percentage; operators need to attribute cache creation/read tokens to sibling groups, stable-prefix families, agent types, and dispatch waves. The goal is to identify whether a shared workload pays repeatedly to create effectively the same prefix.

## Existing approaches
- Provider-side automatic prompt caching.
- Per-request usage fields such as cache read/creation tokens.
- Global token/cost dashboards.
- Manually reducing prompt/context size.
- Sequentializing agents when parallel workflows become too expensive.
- Generic prompt-cache regression monitoring.

## Remaining limitations
- Session-level totals do not reveal sibling fan-out amplification.
- Cache-read ratios can look healthy while each sibling still creates a large private prefix once.
- Raw transcript streams may duplicate records during streaming and require request-ID deduplication.
- Different providers expose different usage field names and cache semantics.
- Generic cache regression alerts do not identify structural locality problems caused by dispatch topology, small prompt deltas, or unstable tool manifests.

## Root-cause analysis
1. Shared parent context is copied into each child rather than referenced/retrieved selectively.
2. Cache breakpoints are positioned so dynamic child prompts contaminate larger stable blocks.
3. Tool definitions/order or injected metadata vary between sibling requests.
4. Agent lanes use isolated cache namespaces/keys or short TTLs.
5. Telemetry is aggregated by session/model instead of by dispatch group and stable-prefix signature.
6. Orchestrators fan out before estimating marginal cache-write amplification.

## Improvement opportunity
Provide a provider-neutral transcript profiler that normalizes usage telemetry, deduplicates request records, groups requests by dispatch/fan-out ID, calculates cache creation/read ratios and sibling write amplification, and blocks or warns on fan-out plans whose measured marginal cache-write cost exceeds policy. Pair the profiler with a workflow that tests structural changes such as stable shared prefixes, selective context retrieval, stable tool manifests, or bounded sequentialization.

## Goal
Reduce avoidable cache-creation tokens in fan-out workflows without removing context required for correctness or lowering result quality.

## Metrics
- cache creation tokens per task and per sibling
- cache read tokens per task and per sibling
- cache-write share = creation / (creation + read + uncached)
- sibling write amplification = total sibling creation / minimum sibling creation baseline
- fan-out marginal creation tokens
- tokens/task, cost/task, latency/task
- quality/regression pass rate

## Trigger
Before scaling a multi-agent workflow, after a client/model/tool-manifest change, or when cache-write spend/latency regresses.

## Inputs
JSONL usage records containing request ID, timestamp, agent/lane, dispatch group, input tokens, cache creation tokens, cache read/cached tokens, optional model/tool-manifest hash, and outcome/quality label.

## Outputs
Machine-readable group metrics, ranked cache-locality hotspots, threshold violations, and before/after comparison evidence.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/82739
- https://github.com/anthropics/claude-code/issues/81967
- https://github.com/anthropics/claude-code/issues/63981
- https://github.com/anthropics/claude-code/issues/74318
- https://docs.github.com/en/copilot/tutorials/optimize-ai-usage
- https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta
