# Research — Agent Compaction Side-Effect Commit Fence

**Topic:** transactional safety at agent context-compaction boundaries  
**Category:** Thinking  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Context compaction is often treated as a text-management operation, but in tool-using agents it also becomes a state-transition boundary. If compaction rotates or rewrites a turn while writes are in flight, the next context may not know whether an external effect committed.

## Why it matters now
Long-running coding and operations agents increasingly combine large contexts with mutating tools, making compaction routine rather than exceptional. Current August 2026 reports show silent side-effect loss and routine history-loss behavior around these boundaries.

## Affected users
Agent-runtime developers, coding-agent users, workflow-platform teams, MCP/tool integrators, and operators of long-lived autonomous sessions.

## Current public evidence

### Observed evidence
1. NousResearch/hermes-agent issue #90985, opened August 20, 2026, reports context compaction tearing down a turn with in-flight mutating calls. A cron creation was issued but never persisted; the issue describes the missing distinction between `issued` and `confirmed`: https://github.com/NousResearch/hermes-agent/issues/90985
2. NousResearch/hermes-agent issue #92080, opened August 22, 2026, reports that compaction session rotation can serialize the parent with an empty message history, leaving only synthetic summary state: https://github.com/NousResearch/hermes-agent/issues/92080
3. NousResearch/hermes-agent issue #28093 documents a related race where a user message arriving during active processing can be omitted when compaction occurs, showing that pending state can fall outside the compaction snapshot: https://github.com/NousResearch/hermes-agent/issues/28093
4. OpenAI Codex issue #35032, opened July 23, 2026, reports repeated compaction in long-running tool-heavy sessions, demonstrating that compaction boundaries can occur frequently under real workloads: https://github.com/openai/codex/issues/35032

### Interpretation
These reports have different symptoms but share one engineering weakness: context compaction lacks a durable, observable quiescence contract for all state that must survive the boundary. A summary can preserve semantic intent while still losing transactional truth.

## Existing approaches
- Token-threshold context compression.
- Turn-level cancellation or generic commit fences.
- Summaries that carry active-task state forward.
- Post-hoc reconciliation daemons.
- Retrying failed tool calls.

## Remaining limitations
- Turn completion does not necessarily mean external side-effect confirmation.
- Summaries cannot prove durable commit.
- Blind replay risks duplicate writes.
- Queued messages and tool results can live outside the snapshot.
- Operators may have no event showing that state became indeterminate.

## Root-cause analysis
1. Agent message state and external side-effect state use different durability models.
2. Tool-call lifecycle is frequently binary instead of multi-stage (`issued`, `confirmed`, `failed`, `indeterminate`).
3. Compaction admission checks token pressure but not transaction quiescence.
4. Recovery logic lacks idempotency-aware reconciliation.
5. Verification relies on the same agent state that compaction may have rewritten.

## Improvement opportunity
Introduce a side-effect ledger with stable action IDs and idempotency keys. A pre-compaction fence blocks while any mutating action is `issued` or `executing`. `indeterminate` actions force reconciliation rather than replay. Read-only calls may finish or be abandoned according to local policy because they do not mutate external state.

## Goal
No mutating action crosses a compaction boundary without a durable terminal record.

## Metrics
- `inflight_mutations_at_compaction`
- `indeterminate_mutations`
- `confirmed_mutation_ratio`
- `duplicate_replay_count`
- `lost_effect_incidents`
- `compaction_deferral_ms`

## Trigger
Any automatic/manual compaction or session rotation while tools are enabled.

## Inputs
Tool lifecycle ledger, mutation classification, idempotency metadata, external confirmation evidence.

## Outputs
`allow`, `defer`, or `escalate` decision plus blocking reasons.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/90985
- https://github.com/NousResearch/hermes-agent/issues/92080
- https://github.com/NousResearch/hermes-agent/issues/28093
- https://github.com/openai/codex/issues/35032
