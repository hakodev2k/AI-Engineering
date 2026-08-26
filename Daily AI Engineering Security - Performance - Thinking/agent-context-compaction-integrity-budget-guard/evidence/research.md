# Research — Agent Context Compaction Integrity Budget Guard

## Topic
Context compaction can save tokens while losing correctness-critical instructions, work state, or completed agent results.

## Category
Token

## Problem
Long-running coding and agent sessions need context reduction. Current compaction can silently discard recent requests, persistent project instructions, intra-session work memory, completed subagent results, or messages near a compaction boundary.

## Why it matters now
2026 agent runtimes increasingly rely on long-lived sessions, parallel subagents, large context windows, and automatic compression. Multiple independent projects report context-size management failures affecting correctness and cost.

## Affected users
Developers using coding agents, multi-agent teams, platform builders, users relying on project instruction files, and operators of long-running assistants with memory/handoff state.

## Current public evidence
### Observed evidence
1. Claude Code #22376 (2026-02-01): auto-compaction can lose critical instructions from the most recent multi-part request, forcing repetition and extra tokens: https://github.com/anthropics/claude-code/issues/22376
2. Claude Code #32099 (2026-03-08): completed subagent results can be dropped, causing redundant reruns and wasted tokens: https://github.com/anthropics/claude-code/issues/32099
3. Claude Code #75759 (2026-07-08): intra-session work memory can be lost after compaction: https://github.com/anthropics/claude-code/issues/75759
4. OpenAI Codex #25792 (2026-06-02): automatic compaction can lose AGENTS/custom rules and regress apparent task progress: https://github.com/openai/codex/issues/25792
5. Hermes Agent #43066 (2026-06-09): compaction loses assistant messages and merges user follow-ups in the child session: https://github.com/NousResearch/hermes-agent/issues/43066
6. OpenClaw #8275 (2026-02-03): compaction can discard decisions/state and lead to repeated work or dangerous actions: https://github.com/openclaw/openclaw/issues/8275
7. OpenClaw #10524 (2026-02-06): proposes a post-compaction continuity hook because task context can be lost: https://github.com/openclaw/openclaw/issues/10524
8. Claude Code #74544 (2026-07-05): very large uncached sessions can make `/compact` itself fail, leaving the session unrecoverable: https://github.com/anthropics/claude-code/issues/74544

### Interpretation
The shared gap is that compaction is evaluated as a context-window operation while users need a semantic integrity contract. A summary does not prove that recent intent, critical constraints, completed work, or actionable evidence remain usable.

## Existing approaches
Automatic/manual compaction; summaries; project instruction files; persistent memory/handoff files; re-injection hooks; larger context windows; prompt caching.

## Remaining limitations
Summaries are not completeness proofs. Persistent files help only if reloaded/retrieved. Re-reading everything erases savings. Larger windows delay rather than eliminate selection. Caching does not restore dropped semantics. Savings and retention are rarely gated together.

## Root-cause analysis
1. No explicit inventory separates correctness-critical context from compressible history.
2. Summary generation and validation are coupled.
3. Recent messages, subagent outputs, and rules cross compaction boundaries through different stores/queues.
4. Retrieval is not always verified before source eviction.
5. Budgets are global rather than per-component.
6. Systems optimize token count without measuring repeated-work/semantic-regression cost.

## Improvement opportunity
Before compaction, mark required items and assign inline retention or a verified retrieval reference. After compaction, enforce provider-measured savings, post-input/output budgets, duplicate-summary limits, and 100% required-item retention. Missing critical context blocks acceptance even if savings are excellent.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/22376
- https://github.com/anthropics/claude-code/issues/32099
- https://github.com/anthropics/claude-code/issues/75759
- https://github.com/openai/codex/issues/25792
- https://github.com/NousResearch/hermes-agent/issues/43066
- https://github.com/openclaw/openclaw/issues/8275
- https://github.com/openclaw/openclaw/issues/10524
- https://github.com/anthropics/claude-code/issues/74544
