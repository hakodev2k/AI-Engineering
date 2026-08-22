# Research — Context Compaction Integrity Guard

## Topic
Context Compaction Integrity Guard

## Category
Token / Thinking

## Problem
Long-running agents increasingly depend on context compaction, but current issue reports show compaction can lose user messages, revive stale work, leak summaries into active chat, fail to reclaim tokens, or enter retry loops that amplify token use. A successful summarization call is therefore not sufficient evidence that compaction preserved task correctness.

## Why it matters now
Fresh August 2026 reports describe reference-only compaction handoffs becoming active turns, visible compaction summaries, and self-amplifying compaction loops. These failures directly affect correctness, token cost, latency, and long-running agent reliability.

## Affected users
Agent-framework developers, coding-agent users, platform teams running persistent sessions, and products with automatic context compression.

## Current public evidence
### Observed evidence
1. Hermes issue #85008, opened 2026-08-13, describes automatic compaction as a black box and proposes materialized handoff for repeated compactions: https://github.com/NousResearch/hermes-agent/issues/85008
2. Hermes issue #86234, opened 2026-08-14, reports compaction summaries surfacing as ordinary transcript messages after metadata is stripped: https://github.com/NousResearch/hermes-agent/issues/86234
3. Hermes issue #80622, opened 2026-08-06, reports a reference-only compaction handoff becoming the active turn and resuming completed work: https://github.com/NousResearch/hermes-agent/issues/80622
4. Prime Agent issue #900, opened 2026-08-08, reports self-amplifying compaction retries after context overflow, where retry debris makes subsequent compaction harder: https://github.com/PrimeIntellect-ai/prime-agent/issues/900
5. OpenClaw issue #101052 reports compaction completing while reclaiming zero tokens, causing repeated compaction and context-window overflow: https://github.com/openclaw/openclaw/issues/101052
6. Hermes issue #28093 reports user messages arriving during processing being dropped when compaction races with message injection: https://github.com/NousResearch/hermes-agent/issues/28093

### Interpretation
Compaction is a state transition, not just summarization. It needs transactional invariants for message coverage, active-goal continuity, token reclamation, persistence, and role/display semantics.

## Existing approaches
- Trigger compaction at a token threshold.
- Summarize old/middle messages and keep a recent tail.
- Retry summarizer errors.
- Protect first/last N messages.
- Manual `/compress` or session reset.

## Remaining limitations
- Token thresholds do not verify reclaimed capacity.
- Summaries can silently alter scope or role semantics.
- Concurrent inbound messages can fall outside both old and new contexts.
- Retry loops can add debris and worsen overflow.
- Persistence and in-memory state can diverge after rotation/restart.

## Root-cause analysis
1. No explicit pre/post compaction invariant set.
2. No atomic boundary between inbound message admission and snapshot creation.
3. Summary text is allowed to carry task authority instead of reference-only provenance.
4. Success is measured by summarizer completion, not token reclamation and coverage.
5. Retry policies are not bounded by changed input or reduced payload.

## Improvement opportunity
Use a transactional compaction contract: freeze an event boundary, capture message IDs, summarize only the closed snapshot, append any concurrent tail afterward, verify all mandatory facts/goals/approvals survive, require minimum token reclamation, mark summary provenance as reference-only, persist then reload-check, and abort/rollback on invariant failure.

## Goal and metrics
- Message coverage: 100% of admitted messages represented in snapshot or post-snapshot tail.
- Critical-fact/active-goal retention on fixtures: 100%.
- Minimum reclaimed tokens: configurable, default 20% of pre-compaction context.
- Compaction retry count <=2.
- Stale-task resurrection fixtures: 0.
- Post-restart context hash/inventory consistency: 100%.

## Trigger / Inputs / Outputs
- Trigger: context utilization threshold or explicit compaction request.
- Inputs: ordered message/event IDs, active goal ledger, facts/approvals, token counts, persistence state.
- Outputs: compacted context, coverage report, before/after token metrics, continuity checks, rollback/commit decision.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/85008
- https://github.com/NousResearch/hermes-agent/issues/86234
- https://github.com/NousResearch/hermes-agent/issues/80622
- https://github.com/PrimeIntellect-ai/prime-agent/issues/900
- https://github.com/openclaw/openclaw/issues/101052
- https://github.com/NousResearch/hermes-agent/issues/28093
