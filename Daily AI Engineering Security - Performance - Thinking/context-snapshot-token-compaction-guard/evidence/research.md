# Research — Context Snapshot Token Compaction Guard

**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Prevent premature agent-context compaction caused by cumulative token accounting being misused as current-context size.

## Problem
An agent runtime may persist or interpret cumulative model usage as if it were the current prompt/context snapshot. Automatic compaction then fires far too early, creating unnecessary cost and potentially losing task-critical state.

## Why it matters now
OpenClaw issue #118772, opened August 3, 2026, reports a high-confidence regression where `sessionEntry.totalTokens` is inflated by cumulative run usage and triggers compaction at only 4–8% of a configured context window. Independent Claude Code reports document destructive post-compaction behavior where recent intent and constraints are lost, causing wrong next actions and cascading hallucination.

## Affected users
Agent-runtime maintainers, developers running long tool loops, coding-agent users, and platforms relying on automatic summarization/compaction.

## Current public evidence

### Observed evidence
1. openclaw/openclaw issue #118772, opened 2026-08-03: cumulative run usage can be persisted as fresh `totalTokens`, causing premature compaction at 4–8% of the configured context window; the issue includes source-level reproduction evidence and proposes persisting last-call usage instead. https://github.com/openclaw/openclaw/issues/118772
2. anthropics/claude-code issue #24792 reports that context compaction can be destructive to summarized state, causing incorrect next actions after compaction. https://github.com/anthropics/claude-code/issues/24792
3. anthropics/claude-code issue #36068 reports auto-compaction dropping user intent and corrections, leading to cascading hallucination mid-session. https://github.com/anthropics/claude-code/issues/36068

### Interpretation
Two separate failure layers compound: token-accounting provenance can trigger compaction incorrectly, and compaction quality can lose critical task state. Therefore the control must verify both trigger correctness and state retention.

## Existing approaches
- Trigger compaction based on session `totalTokens` or provider usage counters.
- Use last-call usage in some paths.
- Summarize history automatically when thresholds are exceeded.
- Reset/clear sessions manually when context becomes too large.

## Remaining limitations
- Provider usage fields may represent cumulative run cost rather than live context size.
- Multiple code paths can set “fresh” token state with different semantics.
- A single threshold cannot compensate for unknown metric provenance.
- Summary quality is not automatically verified against critical recent task state.
- Manual reset avoids overflow but discards useful context and is not reusable automation.

## Root-cause analysis
1. Token fields lack explicit semantic provenance (`cumulative_usage` vs `context_snapshot`).
2. Compaction decisions consume values without validating their source.
3. Sanity checks compare against window size but not against last-call prompt/input evidence.
4. Compaction pipelines do not preserve a deterministic critical-state ledger.
5. Post-compaction verification is often qualitative or absent.

## Improvement opportunity
Require a provenance-tagged `context_snapshot_tokens` value for automatic compaction. Reject cumulative-only counters as triggers. Apply utilization and delta sanity checks, preserve current goal/constraints/decisions/verification status as a compact critical-state ledger, and compare pre/post-compaction coverage before allowing the workflow to continue.

## Relevant sources
- OpenClaw #118772: https://github.com/openclaw/openclaw/issues/118772
- Claude Code #24792: https://github.com/anthropics/claude-code/issues/24792
- Claude Code #36068: https://github.com/anthropics/claude-code/issues/36068
