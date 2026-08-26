# Research — Context Compaction Cost Regression Guard

**Topic:** Context compaction can unexpectedly increase token cost, latency, and context churn.

**Category:** Token

**Research date:** 2026-08-27 (UTC+7)

## Problem
Long-running coding and agent sessions rely on compaction to stay within context limits. Current public reports show several recurring failure modes: compaction requests can miss prompt caches, compaction can immediately refill the context with large repeated attachments, and post-compaction accounting can trigger repeated or premature compaction. These failures can increase uncached input, latency, and session instability instead of reducing context pressure.

## Why it matters now
Multiple August 2026 reports describe expensive, reproducible compaction regressions in major coding-agent runtimes. OpenAI and Anthropic both document compaction as a core mechanism for long-running agent workflows, which makes regressions in this path operationally important rather than edge cases.

## Affected users
Developers using long-running coding agents, agent-platform teams, users with large tool/agent registries, third-party model gateways, and teams measuring token cost or latency per task.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #37305, opened 2026-08-06, reports that the local compaction request omitted tool specifications and therefore failed to match the regular-turn prompt prefix. The reporter measured roughly 235k input tokens at compaction and about +70% additional uncached input on their workload. The proposed local fix restored substantial cache hits in verification runs.  
   https://github.com/openai/codex/issues/37305
2. Anthropic Claude Code issue #84187, opened 2026-08-05, reports context-compaction thrashing where a full `agent_listing_delta` of roughly 110 KB / 27k tokens was re-sent after compaction, rapidly refilling context and causing another compaction within a few turns.  
   https://github.com/anthropics/claude-code/issues/84187
3. Claude Code issue #86789, opened 2026-08-14, reports materially different automatic compaction trigger token counts across sessions using the same model/context settings, including repeated triggers around ~97k in one 1M-context session and ~148k in others.  
   https://github.com/anthropics/claude-code/issues/86789
4. OpenAI documents that Codex uses `/responses/compact` to free context automatically when `auto_compact_limit` is exceeded.  
   https://openai.com/index/unrolling-the-codex-agent-loop/
5. Anthropic documents that prompt caching is prefix based and includes `tools`, `system`, and `messages`, and recommends cache breakpoints around stable content. Its compaction documentation recommends explicit cache boundaries so stable system prompts remain cached across compaction events.  
   https://platform.claude.com/docs/en/build-with-claude/prompt-caching  
   https://platform.claude.com/docs/en/build-with-claude/compaction

### Interpretation
The common engineering weakness is insufficient regression verification around the compaction boundary. A compaction path may be functionally correct yet economically or operationally wrong if it changes stable prefixes, repeats large attachments, produces a large uncached rewrite, or causes another compaction too soon.

## Existing approaches
- Provider-native/server-side compaction.
- Prompt/prefix caching.
- Explicit cache breakpoints for stable system/tool context.
- Manual `/compact` at task boundaries.
- Context usage meters and token accounting.

## Remaining limitations
- Functional tests often verify that a summary exists but not whether cache reuse or post-compaction context size regressed.
- Provider usage fields are heterogeneous, so teams frequently lack a normalized before/after metric.
- Large dynamic tool/agent metadata can be reintroduced immediately after compaction.
- Threshold decisions may rely on stale or inconsistent token accounting.
- A single successful compaction does not prove the session avoids compaction thrashing over subsequent turns.

## Root-cause analysis
1. Stable and dynamic prompt segments are not always separated consistently.
2. Local/alternate compaction code paths can serialize requests differently from normal turns.
3. Post-compaction attachments and tool registries are not budgeted as part of the compaction result.
4. Trigger logic is not always validated against authoritative token counts.
5. Regression tests rarely include a multi-turn post-compaction observation window.

## Improvement opportunity
Add a reusable compaction regression harness that measures pre/post tokens, cached vs uncached input, compaction interval, repeated payload bytes, and quality-critical retained markers. Gate releases when compaction increases uncached input beyond a configured ratio, refills too much of the available context, or triggers again inside a bounded number of turns without a legitimate workload increase.

## Relevant sources
- OpenAI Codex #37305: https://github.com/openai/codex/issues/37305
- Claude Code #84187: https://github.com/anthropics/claude-code/issues/84187
- Claude Code #86789: https://github.com/anthropics/claude-code/issues/86789
- OpenAI Codex agent-loop article: https://openai.com/index/unrolling-the-codex-agent-loop/
- Anthropic prompt caching: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- Anthropic compaction: https://platform.claude.com/docs/en/build-with-claude/compaction
