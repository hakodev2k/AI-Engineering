# Research — Multi-Agent Context Amplification Budget Guard

**Topic:** Inherited context replay and subagent fan-out cause extreme token amplification  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Multi-agent workflows can replay or duplicate parent context—including images and accumulated history—across children and repeated model turns. Token accounting, network traffic, memory, and storage can grow multiplicatively even when the delegated task is bounded.

## Why it matters now
Recent Codex reports provide measured July/August 2026 examples, while Claude Code reports independently describe context duplication and excessive subagent token use.

## Affected users
AI coding-agent users, platform builders, teams using parallel reviewers/subagents, and operators of image-heavy or long-context workflows.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #33235, opened **July 15, 2026**, reports an image-heavy root task with 25 descendants accumulating about **1.48B tokens**, **70.73 GB** visible upstream traffic, multi-gigabyte rollout/image state, and substantial swap growth; the report attributes the multiplicative behavior to inherited inline image context replay. https://github.com/openai/codex/issues/33235
2. OpenAI Codex issue #33196, opened **July 15, 2026**, reports two parallel review subagents each reaching roughly **340M cumulative tokens** within about two minutes, repeated compactions, and aggregate active-session counts around **1.4B tokens**. https://github.com/openai/codex/issues/33196
3. Claude Code issue #84947, opened **August 7, 2026**, reports a built-in subagent whose fixed system/tool overhead is roughly **214k tokens**, exceeding a 200k context limit before useful user input. https://github.com/anthropics/claude-code/issues/84947
4. Claude Code issue #83355, opened **August 2, 2026**, reports subagent compaction using the main session's context-window assumption even when the child runs on a smaller-window model, causing child failures instead of timely compaction. https://github.com/anthropics/claude-code/issues/83355

### Interpretation
These reports indicate multiple implementations share a budget-control problem: subagent creation often happens before the system computes the child-specific cost of inherited static context, media/tool payloads, model window, and expected repeated turns. Context management then reacts after amplification has already occurred.

## Existing approaches
- Hard model context-window limits.
- Auto-compaction/summarization.
- Prompt/KV caching.
- Per-session usage displays.
- Subagent-specific prompts or model routing.
- Manual instructions to reduce context/fan-out.

## Remaining limitations
- Hard limits detect overflow rather than preventing waste.
- Cached tokens may still incur quota, network, or cache-read cost.
- Compaction can trigger repeatedly and still preserve oversized irrelevant payloads.
- Parent context inheritance may not be task-selective.
- Child model context windows can differ from the parent.
- Images, tool results, and stable files may be duplicated rather than referenced by digest.
- Fan-out decisions rarely include a projected amplification factor.

## Root-cause analysis
1. No deterministic pre-dispatch token/context budget.
2. Parent context is copied by default instead of selected by relevance and trust.
3. Large immutable assets lack digest/reference semantics at orchestration boundaries.
4. Context-window metadata is not always child-model-specific.
5. Compaction is reactive and may repeat.
6. Parallelism optimizes wall-clock time without accounting for token/network amplification.

## Improvement opportunity
Before spawning a child, calculate required static tokens, inherited dynamic tokens, expected turns, and child model context limit. Enforce per-child and aggregate fan-out budgets. Deduplicate immutable assets by digest, preserve critical requirements/policy verbatim, and pass only task-relevant evidence. Measure quality regression alongside token/cost reductions.

## Goal
Reduce token, bandwidth, latency, and context pressure while maintaining equal or better task correctness.

## Metrics
Tokens/task; inherited tokens/child; projected and actual amplification factor; cache-read tokens; duplicated asset bytes; compaction count; network bytes; context utilization; result-quality regression rate.

## Trigger
Any subagent dispatch, especially fan-out >1, image/tool-output-heavy context, long histories, or mixed-model context windows.

## Inputs
Parent token estimate, child-specific required tokens, number of children, expected turns, asset digests/bytes, child model context window.

## Outputs
`allow`, `reduce-context`, or `block-fanout` with reason codes and projected metrics.

## Relevant sources
- https://github.com/openai/codex/issues/33235
- https://github.com/openai/codex/issues/33196
- https://github.com/anthropics/claude-code/issues/84947
- https://github.com/anthropics/claude-code/issues/83355
