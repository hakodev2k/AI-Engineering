# Research — Post-Compaction Context Refill Guard
**Topic:** post-compaction context refill thrashing  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Automatic context compaction can be followed by immediate re-injection of large static or semi-static attachments, causing the context window to refill within a few turns and triggering repeated compaction, latency, token waste, or session failure.

## Why it matters now
Recent August 2026 reports describe repeated post-compaction refill in current agent tooling, including large agent registries and project instruction sets.

## Affected users
Developers using coding agents, large plugin/agent registries, instruction-heavy repositories, long-running sessions, and mixed-model subagent setups.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #84187, opened 2026-08-05, reports that after compaction a full `agent_listing_delta` of about 110 KB / 27K tokens can be re-sent repeatedly: https://github.com/anthropics/claude-code/issues/84187
2. Claude Code issue #85489, opened 2026-08-10, reports projects with large `.claude/rules/*.md` plus `CLAUDE.md` entering compaction loops because project instructions are re-injected: https://github.com/anthropics/claude-code/issues/85489
3. Claude Code issue #83355, opened 2026-08-02, reports subagent auto-compaction resolving context limits from the main-session model rather than a smaller subagent model: https://github.com/anthropics/claude-code/issues/83355
4. VS Code tool guidance explains that every available tool and tool output expands model decision/context space and recommends narrowing tools to preserve context and performance: https://code.visualstudio.com/docs/agents/concepts/tools

### Interpretation
The recurring gap is not simply "context too large." It is the lack of a measurable post-compaction refill contract by source and active model window. Compaction can reduce history yet fail to create durable headroom if a large fixed prefix is immediately reconstructed.

## Existing approaches
Automatic/manual compaction, larger windows, prompt caching, fewer tools, fewer auto-loaded instructions, and starting a fresh session.

## Remaining limitations
- Reactive compaction does not bound refill after compaction.
- Static context may be repeated even when unchanged.
- Warning messages may not attribute refill to the exact source.
- Mixed-model agents can have different effective budgets.
- Manual context removal can cause correctness regressions.

## Root-cause analysis
1. Static and dynamic context are not budgeted separately.
2. Attachments are assembled eagerly instead of lazily.
3. Deduplication is not guaranteed across compaction boundaries.
4. Context limits may be computed from the wrong model.
5. Quality verification is often absent after context reduction.

## Improvement opportunity
Record per-source token contribution immediately after compaction, calculate refill ratios against the active model window, enforce source caps and a total post-compaction budget, then require regression checks before accepting context removal.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/84187
- https://github.com/anthropics/claude-code/issues/85489
- https://github.com/anthropics/claude-code/issues/83355
- https://code.visualstudio.com/docs/agents/concepts/tools
