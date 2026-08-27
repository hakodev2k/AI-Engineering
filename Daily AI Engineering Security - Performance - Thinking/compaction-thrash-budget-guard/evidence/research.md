# Research — Compaction Thrash Budget Guard

**Topic:** Compaction thrash and redundant context re-expansion in coding agents  
**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Automatic context compaction can become counterproductive when a runtime immediately re-adds large static attachments, misreads rolled-up usage as live context, or retries failed compactions against the same oversized state. The result is repeated compaction, cache rewrites, latency, and token spend without corresponding progress.

## Why it matters now
Multiple August 2026 Claude Code issues report distinct forms of the same operational failure: full agent registry reattachment after compaction, auto-compaction triggered hundreds of thousands of tokens early because advisor usage is summed across iterations, and repeated prompt-cache drops causing millions of redundant cache-write tokens. Earlier 2026 reports also document multi-compaction retry loops consuming roughly one million tokens without user activity.

## Affected users
Developers using long-running coding agents, teams with many subagents/plugins, agent-platform builders, and users operating large-context models where token/caching costs and session recoverability matter.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #84187, opened August 5, 2026, reports that after compaction a full ~110 KB / ~27K-token agent listing is re-sent on nearly every turn, rapidly refilling context: https://github.com/anthropics/claude-code/issues/84187
2. Claude Code issue #84738, opened August 7, 2026, reports advisor usage being rolled up across iterations, making auto-compaction see roughly twice the real context and compact hundreds of thousands of tokens early: https://github.com/anthropics/claude-code/issues/84738
3. Claude Code issue #83542, opened August 3, 2026, reports 17 prompt-cache drops in about three hours and approximately 10.4M redundant cache-write tokens: https://github.com/anthropics/claude-code/issues/83542
4. Claude Code issue #41198, opened March 30, 2026, documents five compaction agents in five minutes processing roughly 19 MB context each, estimated at ~1M tokens while no user was present: https://github.com/anthropics/claude-code/issues/41198

### Interpretation
The common failure is a control-loop problem rather than merely "too much context": the compaction trigger, post-compaction context assembler, cache layer, and retry controller are not jointly constrained by a token/progress budget. A compaction can therefore make no durable reduction in effective context.

## Existing approaches
- Automatic context compaction near model limits.
- Prompt caching for stable prefixes.
- Manual compaction or session restart.
- Large context windows.
- Runtime usage telemetry and hook systems.

## Remaining limitations
- Large windows postpone, but do not prevent, repeated static context growth.
- Prompt caching reduces some cost but cache drops or changing prefixes can recreate tokens.
- Manual recovery is reactive and may lose task state.
- A token counter alone cannot distinguish productive growth from repeated static payloads.
- Compaction triggers that rely on rolled-up usage can fire on accounting artifacts rather than true live context.

## Root-cause analysis
1. Static agent/tool/context payloads are reattached after compaction without a reload budget.
2. Usage accounting may combine iterations and overstate the active context.
3. Cache creation/read behavior is not part of the compaction decision.
4. Retry loops lack a hard bound tied to measurable context reduction.
5. Progress is not checked before spending another large compaction attempt.

## Improvement opportunity
Introduce a pre-compaction guard using trace-level measurements: minimum turn spacing, post-compaction growth, repeated-static tokens, cache read/create ratios, live-versus-reported usage divergence, and progress events. Require measurable context reduction before another compaction is permitted, and stop after bounded retries.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/84187
- https://github.com/anthropics/claude-code/issues/84738
- https://github.com/anthropics/claude-code/issues/83542
- https://github.com/anthropics/claude-code/issues/41198
